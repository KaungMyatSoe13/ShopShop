import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

function Collapsible({ isOpen, children }) {
  return (
    <div
      style={{
        maxHeight: isOpen ? "1000px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}
    >
      <div className="pt-2">{children}</div>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("MEDIUM");
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const changeImageWithFade = (newIndex) => {
    setIsFading(true); // start fade out

    setTimeout(() => {
      setSelectedImageIndex(newIndex); // change image after fade out
      setIsFading(false); // fade in
    }, 300); // duration matches CSS transition duration
  };

  // For swipe handling
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);

        setProductImages([
          data.image,
          data.image + "?1", // your custom image in public/images/
          data.image + "?2",
          data.image + "?3",
        ]);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };
    fetchProduct();
  }, [id]);

  const selectedImage = productImages[selectedImageIndex] || "";

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Keyboard navigation inside modal
  const onKeyDown = useCallback(
    (e) => {
      if (!showPreview) return;
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev === productImages.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev === 0 ? productImages.length - 1 : prev - 1
        );
      } else if (e.key === "Escape") {
        setShowPreview(false);
      }
    },
    [showPreview, productImages.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Swipe handlers for modal
  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const threshold = 50; // minimum swipe distance in px

    if (distance > threshold) {
      // swipe left → next image
      setSelectedImageIndex((prev) =>
        prev === productImages.length - 1 ? 0 : prev + 1
      );
    } else if (distance < -threshold) {
      // swipe right → previous image
      setSelectedImageIndex((prev) =>
        prev === 0 ? productImages.length - 1 : prev - 1
      );
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center relative">
            {/* Heart Button */}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-2 right-2 z-10"
              aria-label="Favorite"
            >
              <FaHeart
                size={22}
                className={`transition-colors duration-300 hover:cursor-pointer ${
                  isFavorited
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-300 "
                }`}
              />
            </button>

            <img
              src={selectedImage}
              alt={product.title}
              onClick={() => setShowPreview(true)}
              className={`w-full h-[78%] object-contain transition-all duration-300 cursor-pointer select-none`}
              style={{
                opacity: isFading ? 0 : 1,
                transition: "opacity 0.3s ease",
                userSelect: "none",
              }}
              draggable={false}
            />

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-3">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => changeImageWithFade(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition ${
                    selectedImageIndex === index
                      ? "bg-black"
                      : "bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-semibold text-gray-900">
              ${product.price}
            </p>

            {/* Size */}
            <div>
              <h3 className="font-semibold text-sm">Size</h3>
              <div className="flex gap-2 mt-2">
                {["MEDIUM", "LARGE", "XLARGE"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1  border transition hover:cursor-pointer ${
                      size === s
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-sm">Quantity</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-20 px-2 py-1 border"
              />
            </div>

            {/* Buy Button */}
            <button className="mt-4 bg-black text-white px-6 py-2 hover:opacity-80 transition w-full">
              Add To Cart{" "}
            </button>

            {/* Collapsible Sections */}
            <div className="space-y-4 text-sm text-gray-700 pt-6 border-t">
              {/* Details */}
              <div>
                <div
                  onClick={() => toggleSection("details")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline text-lg">
                    Details
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "details" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "details"}>
                  <div className="space-y-2 mt-2">
                    <p>• DROP SHOULDER TEE.</p>
                    <p>• 100% COTTON, 230 GSM</p>
                    <p>• SCREENPRINTED GRAPHIC</p>
                    <p>• Size: MEDIUM, LARGE, XLARGE</p>
                  </div>
                </Collapsible>
              </div>

              {/* Size Guide */}
              <div className="border-t pt-4">
                <div
                  onClick={() => toggleSection("size")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline  text-lg">
                    Size Guide
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "size" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "size"}>
                  <div className="overflow-x-auto mt-2">
                    <table className="table-auto w-full text-left border">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Size</th>
                          <th className="border px-2 py-1">Chest (in)</th>
                          <th className="border px-2 py-1">Length (in)</th>
                          <th className="border px-2 py-1">Shoulder (in)</th>
                          <th className="border px-2 py-1">Sleeve (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">MEDIUM</td>
                          <td className="border px-2 py-1">22</td>
                          <td className="border px-2 py-1">29</td>
                          <td className="border px-2 py-1">22</td>
                          <td className="border px-2 py-1">8.5</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">LARGE</td>
                          <td className="border px-2 py-1">23.5</td>
                          <td className="border px-2 py-1">30</td>
                          <td className="border px-2 py-1">23</td>
                          <td className="border px-2 py-1">9</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1">XLARGE</td>
                          <td className="border px-2 py-1">25</td>
                          <td className="border px-2 py-1">31</td>
                          <td className="border px-2 py-1">24</td>
                          <td className="border px-2 py-1">9.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Collapsible>
              </div>

              {/* Shipping */}
              <div className="border-t pt-4 border-b pb-4">
                <div
                  onClick={() => toggleSection("shipping")}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="font-semibold hover:underline  text-lg">
                    Shipping
                  </span>
                  <FaPlus
                    className={`transform transition-transform duration-300 ${
                      openSection === "shipping" ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                <Collapsible isOpen={openSection === "shipping"}>
                  <ul className="list-disc pl-5 mt-2">
                    <li>YANGON: 1–2 business days</li>
                    <li>MANDALAY: 2–4 business days</li>
                    <li>OTHER CITIES: 2–7 business days</li>
                  </ul>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ userSelect: "none" }}
        >
          {/* Stop modal close when clicking on image */}
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90%] object-contain  select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev === 0 ? productImages.length - 1 : prev - 1
              );
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 text-white  p-2 hover:text-gray-300 transition"
            aria-label="Previous Image"
          >
            <FaArrowLeft size={30} className="hover:cursor-pointer" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev === productImages.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-white  p-2 hover:text-gray-300 transition"
            aria-label="Next Image"
          >
            <FaArrowRight size={30} className="hover:cursor-pointer" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
