import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddPackageElement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOKEN } from "../Api/Api";

const AddPackageElement = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const packageId = props.packageId || params.id;
    const { onSubmit } = props;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/GetAllOwnerCategories")
            .then((res) => res.json())
            .then((data) => {
                if (data.owners_categories) {
                    setCategories(data.owners_categories);
                }
            })
            .catch(() => setCategories([]));
    }, []);

    const handleFiles = (files) => {
        const fileArr = Array.from(files);
        setImages((prev) => [...prev, ...fileArr]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleImageRemove = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e) => {
        handleFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !type || images.length === 0) return;
        if (!packageId) {
            toast.error("No packageId provided!");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("discription", description);
        const selectedCategory = categories.find(cat => String(cat.id) === String(type));
        formData.append("type", selectedCategory ? selectedCategory.name : "");
        images.forEach((img, idx) => {
            formData.append(`pictures[${idx}]`, img);
        });
        // Debug: print FormData content
        console.log("=== FormData Debug ===");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log("Package ID:", packageId);
        console.log("TOKEN:", TOKEN);
        console.log("======================");
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tourism/addPackageElement/${packageId}`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            });
            
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log("Success response:", responseData);
                toast.success("Element added successfully!", { position: "top-right" });
                setTimeout(() => {
                    navigate(`/package/${packageId}`,{ replace: true });
                }, 1200);
                setName("");
                setDescription("");
                setType("");
                setImages([]);
                if (onSubmit) onSubmit();
            } else {
                const errorText = await response.text();
                console.error("Error response text:", errorText);
                
                let errorData = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    console.error("Failed to parse error response as JSON");
                }
                
                console.error("Error response data:", errorData);
                toast.error(errorData?.message || `Server error: ${response.status}`, { position: "top-right" });
            }
        } catch (err) {
            console.error("Network/fetch error:", err);
            toast.error("Network error occurred while adding element.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-package-element-container">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <form
                className="add-package-element-form"
                onSubmit={handleSubmit}
                dir="ltr"
            >
                <h2 className="add-package-element-title">Add New Package Element</h2>
                <div className="add-package-element-field">
                    <label className="add-package-element-label">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="add-package-element-input"
                        required
                    />
                </div>
                <div className="add-package-element-field">
                    <label className="add-package-element-label">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="add-package-element-textarea"
                        required
                    />
                </div>
                <div className="add-package-element-field">
                    <label className="add-package-element-label">Category:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="add-package-element-input"
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="add-package-element-field">
                    <label className="add-package-element-label">Images:</label>
                    <div
                        className={`add-package-element-drag-drop${dragActive ? " drag-active" : ""}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleInputChange}
                        />
                        {images.length === 0 ? (
                            <>
                                <div className="add-package-element-upload-icon">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <span className="add-package-element-upload-text">
                                    Drag & drop images here or click to select from your device
                                </span>
                                <div className="add-package-element-upload-helper">
                                    You can upload multiple images at once (PNG, JPG, JPEG)
                                </div>
                            </>
                        ) : (
                            <div className="add-package-element-thumbnails">
                                {images.map((img, idx) => (
                                    <div key={idx} className="add-package-element-thumbnail-wrapper">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`preview-${idx}`}
                                            className="add-package-element-thumbnail"
                                        />
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); handleImageRemove(idx); }}
                                            className="add-package-element-remove-btn"
                                            title="Remove image"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="add-package-element-submit"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Element"}
                </button>
            </form>
        </div>
    );
};

export default AddPackageElement; 