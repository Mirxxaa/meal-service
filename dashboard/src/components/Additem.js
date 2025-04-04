import React, { useState, useEffect } from "react";
import { X, Upload, Image, AlertTriangle } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";
import { createItem, getAllCategories } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Add-item.css";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    image: null,
    nameEnglish: "",
    nameArabic: "",
    descriptionEnglish: "",
    descriptionArabic: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "Non Veg",
    category: "",
    prices: [{ currency: "SAR", sellingPrice: "", discountPrice: "" }],
    services: {
      subscription: false,
      indoorCatering: false,
      outdoorCatering: false,
      dining: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const result = await getAllCategories();
      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data);
        if (result.data.length > 0) {
          setItem((prevItem) => ({
            ...prevItem,
            category: result.data[0]._id || "",
          }));
        }
      } else {
        console.error("Failed to fetch categories:", result.error);
        setError("Failed to fetch categories. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("An error occurred while fetching categories.");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleServiceChange = (service) => {
    setItem((prevState) => ({
      ...prevState,
      services: {
        ...prevState.services,
        [service]: !prevState.services[service],
      },
    }));
    setShowWarning(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handlePriceChange = (index, field, value) => {
    const newPrices = [...item.prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setItem((prevState) => ({
      ...prevState,
      prices: newPrices,
    }));
  };

  const addPrice = () => {
    setItem((prevState) => ({
      ...prevState,
      prices: [
        ...prevState.prices,
        { currency: "SAR", sellingPrice: "", discountPrice: "" },
      ],
    }));
  };

  const removePrice = (index) => {
    if (item.prices.length > 1) {
      setItem((prevState) => ({
        ...prevState,
        prices: prevState.prices.filter((_, i) => i !== index),
      }));
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `items/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      setError("Please add a category first before adding an item.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = "";
      if (item.image) {
        imageUrl = await uploadImage(item.image);
      }

      const itemData = {
        ...item,
        image: imageUrl,
        calories: parseFloat(item.calories),
        protein: parseFloat(item.protein),
        carbs: parseFloat(item.carbs),
        fat: parseFloat(item.fat),
        prices: item.prices.map((price) => ({
          ...price,
          sellingPrice: parseFloat(price.sellingPrice),
          discountPrice: price.discountPrice
            ? parseFloat(price.discountPrice)
            : null,
        })),
      };

      const result = await createItem(itemData);
      if (result.success) {
        setSuccess(true);
        setItem({
          image: null,
          nameEnglish: "",
          nameArabic: "",
          descriptionEnglish: "",
          descriptionArabic: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          type: "Non Veg",
          category: categories[0]?._id || "",
          prices: [{ currency: "SAR", sellingPrice: "", discountPrice: "" }],
          services: {
            subscription: false,
            indoorCatering: false,
            outdoorCatering: false,
            dining: false,
          },
        });
      } else {
        setError(result.error || "Failed to add item. Please try again.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setError("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="add-item-page">
        <h1>Add New Item</h1>
        <div className="error-message">
          No categories available. Please add a category first.
        </div>
        <button onClick={() => navigate("/items")} className="submit-btn">
          Go to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="add-item-page ">
      <h1>Add New Item</h1>
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Item added successfully!</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="image-upload"
              className="hidden"
            />
            <label htmlFor="image-upload" className="upload-area">
              {item.image ? (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(item.image)}
                    alt="Item"
                    className="uploaded-image"
                  />
                  <div className="image-overlay">
                    <Image size={24} />
                    <span>Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={48} />
                  <span>Upload Image</span>
                </div>
              )}
            </label>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <input
                type="text"
                name="nameEnglish"
                placeholder="Name in English"
                value={item.nameEnglish}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="nameArabic"
                placeholder="Name in Arabic"
                value={item.nameArabic}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="descriptionEnglish"
                placeholder="Description in English"
                value={item.descriptionEnglish}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="descriptionArabic"
                placeholder="Description in Arabic"
                value={item.descriptionArabic}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="calories"
                placeholder="Calories"
                value={item.calories}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="protein"
                placeholder="Protein (g)"
                value={item.protein}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="carbs"
                placeholder="Carbs (g)"
                value={item.carbs}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="fat"
                placeholder="Fat (g)"
                value={item.fat}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <select
                name="type"
                value={item.type}
                onChange={handleInputChange}
                required
              >
                <option value="Non Veg">Non Veg</option>
                <option value="Veg">Veg</option>
              </select>
              <select
                name="category"
                value={item.category}
                onChange={handleInputChange}
                required
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* New Services Section */}
            <div className="services-section">
              <h3>Available Services</h3>
              {showWarning && (
                <div className="warning-message">
                  <AlertTriangle size={16} />
                  <span>
                    Warning: Service options cannot be modified after creation.
                    Please choose carefully.
                  </span>
                </div>
              )}
              <div className="services-grid">
                <label className="service-option">
                  <input
                    type="checkbox"
                    checked={item.services.subscription}
                    onChange={() => handleServiceChange("subscription")}
                  />
                  <span>Subscription</span>
                </label>
                <label className="service-option">
                  <input
                    type="checkbox"
                    checked={item.services.indoorCatering}
                    onChange={() => handleServiceChange("indoorCatering")}
                  />
                  <span>Indoor Catering</span>
                </label>
                <label className="service-option">
                  <input
                    type="checkbox"
                    checked={item.services.outdoorCatering}
                    onChange={() => handleServiceChange("outdoorCatering")}
                  />
                  <span>Outdoor Catering</span>
                </label>
                <label className="service-option">
                  <input
                    type="checkbox"
                    checked={item.services.dining}
                    onChange={() => handleServiceChange("dining")}
                  />
                  <span>Dining</span>
                </label>
              </div>
            </div>

            <div className="price-section">
              {item.prices.map((price, index) => (
                <div key={index} className="price-group">
                  <select
                    value={price.currency}
                    onChange={(e) =>
                      handlePriceChange(index, "currency", e.target.value)
                    }
                    required
                  >
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                    <option value="BHD">BHD</option>
                    <option value="QAR">QAR</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Selling Price"
                    value={price.sellingPrice}
                    onChange={(e) =>
                      handlePriceChange(index, "sellingPrice", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Discount Price (optional)"
                    value={price.discountPrice}
                    onChange={(e) =>
                      handlePriceChange(index, "discountPrice", e.target.value)
                    }
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePrice(index)}
                      className="remove-price"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPrice} className="add-price">
                + Add Price
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "SAVE"}
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;
