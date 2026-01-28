import React, { useState } from "react";

export const BouquetModal = ({ mode, bouquet, onClose, onSave }) => {
  const [formData, setFormData] = useState(() => {
    if (mode === "update" && bouquet) {
      return {
        name: bouquet.name || "",
        description: bouquet.description || "",
        price: bouquet.price || "",
        status: bouquet.status ?? 1,
        images: bouquet.images
          ? bouquet.images.map((img) => ({
              ...img,
              image:
                img.image && !img.image.startsWith("http") && !img.image.startsWith("data:")
                  ? `data:image/jpeg;base64,${img.image}`
                  : img.image,
              isExisting: true,
            }))
          : [],
        materials: bouquet.materials || [],
      };
    }
    return { name: "", description: "", price: "", status: 1, images: [], materials: [] };
  });

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [materialInput, setMaterialInput] = useState({ name: "", quantity: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMAGES = 5;
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (formData.images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        setError(`Image "${file.name}" is too large. Max size is 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { image: event.target.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
    setError("");
  };

  const handleAddUrl = () => {
    if (!imageUrl.trim()) return;
    const MAX_IMAGES = 5;
    if (formData.images.length >= MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { image: imageUrl }],
    }));
    setImageUrl("");
    setError("");
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddMaterial = () => {
    if (!materialInput.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { ...materialInput }],
    }));
    setMaterialInput({ name: "", quantity: 1 });
  };

  const handleRemoveMaterial = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (formData.images.length === 0) {
      setError("At least one image is required.");
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      status: parseInt(formData.status),
      images: formData.images.filter((img) => !img.isExisting).map((img) => img.image),
    };
    onSave(payload);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
        <h2>{mode === "create" ? "Create Bouquet" : "Update Bouquet"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: "100%" }} />
          </label>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: "100%" }} />
          </label>
          <label>
            Price:
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required style={{ width: "100%" }} />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange} style={{ width: "100%" }}>
              <option value={1}>On Sale</option>
              <option value={0}>Stopped</option>
            </select>
          </label>

          {/* Material Section */}
          <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Materials:</label>
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Material Name"
                value={materialInput.name}
                onChange={(e) => setMaterialInput({ ...materialInput, name: e.target.value })}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                placeholder="Qty"
                value={materialInput.quantity}
                onChange={(e) => setMaterialInput({ ...materialInput, quantity: parseInt(e.target.value) || 1 })}
                style={{ width: "60px" }}
                min="1"
              />
              <button type="button" onClick={handleAddMaterial}>Add</button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {formData.materials.map((mat, index) => (
                <li key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", padding: "5px", background: "#f9f9f9", borderRadius: "4px" }}>
                  <span>{mat.name} (x{mat.quantity})</span>
                  <button type="button" onClick={() => handleRemoveMaterial(index)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>&times;</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Upload Section */}
          <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Images (Max 5):</label>
            
            {/* URL Input */}
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
              <input 
                type="text" 
                placeholder="Paste Image URL" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddUrl}>Add URL</button>
            </div>

            {/* File Input */}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
              style={{ marginBottom: "10px" }}
            />

            {error && <p style={{ color: "red", fontSize: "12px", margin: "0 0 10px" }}>{error}</p>}

            {/* Image Preview List */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {formData.images.map((img, index) => (
                <div key={index} style={{ position: "relative", width: "80px", height: "80px" }}>
                  <img 
                    src={img.image} 
                    alt={`preview-${index}`} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(index)}
                    style={{ 
                      position: "absolute", top: "-5px", right: "-5px", 
                      background: "red", color: "white", border: "none", 
                      borderRadius: "50%", width: "20px", height: "20px", 
                      cursor: "pointer", fontSize: "12px", display: "flex", 
                      alignItems: "center", justifyContent: "center" 
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};