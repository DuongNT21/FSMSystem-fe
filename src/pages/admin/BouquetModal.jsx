import React, { useState, useEffect, useMemo } from "react";
import { X, CloudUpload, Trash2, Plus } from "lucide-react";
import { bouquetApi, materialApi, categoryApi } from "../../apis/flowerApi";

export const BouquetModal = ({ isOpen, onClose, bouquet, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: 1,
    description: "",
    categoryId: "",
    materials: []
  });
  const [allMaterials, setAllMaterials] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // { id, image, publicId }
  const [deletedPublicIds, setDeletedPublicIds] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [materialError, setMaterialError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [materialPrices, setMaterialPrices] = useState({}); // { [materialId]: price }

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await materialApi.getAll({ size: 100 });
        const d = response?.data;
        const list = Array.isArray(d)
          ? d
          : Array.isArray(d?.data?.items)
          ? d.data.items
          : Array.isArray(d?.data)
          ? d.data
          : Array.isArray(d?.items)
          ? d.items
          : [];
        setAllMaterials(list);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll({ size: 100 });
        const payload = response?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        setAllCategories(list);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchMaterials();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (bouquet) {
      setFormData({
        name: bouquet.name || "",
        price: bouquet.price || "",
        status: bouquet.status || 1,
        description: bouquet.description || "",
        categoryId: bouquet.category?.id || "",
        materials: (bouquet.bouquetsMaterials ?? []).map(m => ({
          name: m.rawMaterialName,
          quantity: m.quantity
        }))
      });
      setExistingImages(bouquet.images?.map(img => ({ id: img.id, image: img.image, publicId: img.publicId })) || []);

      (bouquet.bouquetsMaterials ?? []).forEach(m => {
        if (m.rawMaterialId) {
          bouquetApi.getCost(m.rawMaterialId)
            .then(res => {
              const price = res?.data?.data ?? res?.data ?? res;
              if (typeof price === 'number') {
                setMaterialPrices(prev => ({ ...prev, [m.rawMaterialId]: price }));
              }
            })
            .catch(error => console.error(error));
        }
      });
    } else {
      setFormData({
        name: "",
        price: "",
        status: 1,
        description: "",
        categoryId: "",
        materials: []
      });
      setExistingImages([]);
    }
    setDeletedPublicIds([]);
    setSelectedImages([]);
    setNewImagePreviews([]);
    setMaterialPrices({});
  }, [bouquet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMaterial = (materialId) => {
    if (!materialId) return;
    const mat = allMaterials.find(m => Number(m.id) === parseInt(materialId));
    if (!mat) return;
    if (formData.materials.find(m => m.name === mat.name)) return;

    setFormData({
      ...formData,
      materials: [...formData.materials, { name: mat.name, quantity: 1 }]
    });

    // Fetch dynamic unit price
    bouquetApi.getCost(materialId)
      .then(res => {
        const price = res?.data?.data ?? res?.data ?? res;
        if (typeof price === 'number') {
          setMaterialPrices(prev => ({ ...prev, [mat.id]: price }));
        }
      })
      .catch(error => {
        console.error(`Error fetching cost for material ${materialId}:`, error);
        // Fallback to importPrice is handled in the useMemo and render
      });
  };

  const handleUpdateMaterialQty = (name, qty) => {
    setFormData({
      ...formData,
      materials: formData.materials.map(m => m.name === name ? { ...m, quantity: parseInt(qty) || 1 } : m)
    });
  };

  const handleRemoveMaterial = (name) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter(m => m.name !== name)
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + newImagePreviews.length > 5) {
      alert("Tối đa 5 hình ảnh");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    if (index < existingImages.length) {
      // Existing Cloudinary image — mark its publicId for deletion
      const removed = existingImages[index];
      setDeletedPublicIds(prev => [...prev, removed.id]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // New file not yet uploaded
      const newIndex = index - existingImages.length;
      setSelectedImages(prev => prev.filter((_, i) => i !== newIndex));
      setNewImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const totalMaterialCost = useMemo(() => {
    return formData.materials.reduce((sum, m) => {
      const mat = allMaterials.find(am => am.name === m.name);
      if (!mat) return sum;
      const unitPrice = materialPrices[mat.id] ?? mat?.importPrice ?? mat?.price ?? 0;
      return sum + unitPrice * m.quantity;
    }, 0);
  }, [formData.materials, allMaterials, materialPrices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMaterialError("");
    setCategoryError("");

    try {
      const formDataToSend = new FormData();
      
      const requestPayload = {
        name: formData.name,
        price: parseFloat(formData.price),
        status: parseInt(formData.status),
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        materials: formData.materials
          .map(m => ({ id: allMaterials.find(am => am.name === m.name)?.id, quantity: m.quantity }))
          .filter(m => m.id != null)
      };
      if (bouquet && deletedPublicIds.length > 0) {
        requestPayload.deleteImages = deletedPublicIds;
      }
      const requestJson = JSON.stringify(requestPayload);

      formDataToSend.append("request", requestJson);
      
      selectedImages.forEach(file => {
        formDataToSend.append("images", file);
      });

      if (bouquet) {
        formDataToSend.append("id", bouquet.id);
        await bouquetApi.update(formDataToSend);
      } else {
        await bouquetApi.create(formDataToSend);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving bouquet:", error);
      const msg = error?.response?.data?.message || "";
      if (error?.response?.status === 400 && msg.toLowerCase().includes("raw material")) {
        setMaterialError(msg);
      } else if (error?.response?.status === 400 && msg.toLowerCase().includes("category")) {
        setCategoryError(msg);
      } else {
        alert("Lỗi khi lưu sản phẩm");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{bouquet ? "Cập Nhật Sản Phẩm" : "Tạo Mới Sản Phẩm"}</h3>
            <p className="text-sm text-slate-500 mt-1">Điền thông tin chi tiết cho bó hoa của bạn</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto">
          <form className="space-y-6" id="bouquetForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Tên sản phẩm</label>
                <input 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none" 
                  placeholder="Nhập tên bó hoa..." 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">Giá bán (VND)</label>
                  {totalMaterialCost > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, price: totalMaterialCost }))}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Áp dụng giá vật tư: {new Intl.NumberFormat("vi-VN").format(totalMaterialCost)} đ
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                    placeholder="0"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">VND</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Thành phần vật tư</label>
              {materialError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                  {materialError}
                </div>
              )}
              <div className="flex gap-2">
                <select 
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                  onChange={(e) => handleAddMaterial(e.target.value)}
                  value=""
                >
                  <option value="">Chọn vật tư để thêm...</option>
                  {allMaterials.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {formData.materials.length > 0 && (
                <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-slate-500">Tên vật tư</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-slate-500 w-28 text-right">Đơn giá</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-slate-500 w-24">Số lượng</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-slate-500 w-28 text-right">Thành tiền</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-slate-500 w-12 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.materials.map((m) => {
                        const matInfo = allMaterials.find(am => am.name === m.name);
                        const unitPrice = matInfo ? (materialPrices[matInfo.id] ?? matInfo.importPrice ?? matInfo.price ?? 0) : 0;
                        const lineTotal = unitPrice * m.quantity;
                        return (
                          <tr key={m.name}>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-slate-700">{m.name}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-slate-500 font-mono">
                              {unitPrice > 0 ? new Intl.NumberFormat("vi-VN").format(unitPrice) : <span className="italic text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                                min="1"
                                type="number"
                                value={m.quantity}
                                onChange={(e) => handleUpdateMaterialQty(m.name, e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-semibold text-slate-600 font-mono">
                              {unitPrice > 0 ? new Intl.NumberFormat("vi-VN").format(lineTotal) : <span className="italic text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveMaterial(m.name)}
                                className="text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {totalMaterialCost > 0 && (
                    <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                        Ước tính chi phí vật tư
                      </span>
                      <span className="text-sm font-bold text-rose-600 font-mono">
                        {new Intl.NumberFormat("vi-VN").format(totalMaterialCost)} đ
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Mô tả sản phẩm</label>
              <textarea 
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none resize-none" 
                placeholder="Mô tả về các loại hoa, ý nghĩa và kích thước..." 
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Trạng thái kinh doanh</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none cursor-pointer"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="1">Đang bán (On Sale)</option>
                  <option value="0">Tạm ngưng (Stopped)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Danh mục</label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${categoryError ? "border-red-400" : "border-slate-200"} focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none cursor-pointer`}
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {allCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {categoryError && (
                  <p className="text-red-500 text-xs font-medium">{categoryError}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="block text-sm font-semibold text-slate-700">Hình ảnh sản phẩm (Tối đa 5)</label>
                <span className="text-xs text-slate-400 italic">Hỗ trợ JPG, PNG lên đến 5MB</span>
              </div>
              
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-rose-500 transition-colors cursor-pointer bg-slate-50/50 group relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <CloudUpload className="text-slate-300 group-hover:text-rose-500 transition-colors mb-2" size={40} />
                  <p className="text-sm font-medium text-slate-600">Kéo thả file vào đây hoặc <span className="text-rose-500 hover:underline">duyệt file</span></p>
                </div>
              </div>

              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="grid grid-cols-5 gap-3 pt-2">
                  {existingImages.map((img, idx) => (
                    <div key={img.id} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group">
                      <img alt={`Existing ${idx}`} className="w-full h-full object-cover" src={img.image} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-white/90 text-rose-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg border border-dashed border-rose-300 overflow-hidden group">
                      <img alt={`New ${idx}`} className="w-full h-full object-cover" src={preview} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(existingImages.length + idx)}
                        className="absolute top-1 right-1 bg-white/90 text-rose-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
          <button 
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button 
            className="px-8 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 rounded-lg transition-all transform active:scale-95 disabled:opacity-50" 
            type="submit"
            form="bouquetForm"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : (bouquet ? "Cập nhật" : "Tạo mới")}
          </button>
        </div>
      </div>
    </div>
  );
};
