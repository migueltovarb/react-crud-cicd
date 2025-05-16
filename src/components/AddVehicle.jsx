import { useState } from "react";
import axios from "axios";

const AddVehicle = ({ onClose, onAddVehicle }) => {
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    color: "1", 
    modelo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const colorOptions = [
    { value: "1", label: "ROJO", bgColor: "bg-red-500" },
    { value: "2", label: "AZUL", bgColor: "bg-blue-500" },
    { value: "3", label: "VERDE", bgColor: "bg-green-500" },
  ];

  const validateForm = () => {
    let errors = {};

    if (formData.placa.length > 6) {
      errors.placa = "La placa no puede superar los 6 caracteres.";
    }
    if (formData.marca.length > 10) {
      errors.marca = "La marca no puede superar los 10 caracteres.";
    }
    if (!/^\d+$/.test(formData.modelo) || parseInt(formData.modelo) <= 0) {
      errors.modelo = "El modelo debe ser un número entero positivo.";
    }
    console.log("Errores de validación:", errors);
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/vehiculo/crear`, formData);
      onAddVehicle(response.data); 
      onClose(); 
    } catch (error) {
      console.error("Error al agregar el vehículo:", error);
      setError("No se pudo agregar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Agregar Vehículo</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="placa"
              placeholder="Placa (máx. 6 caracteres)"
              value={formData.placa}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {validationErrors.placa && (
                <p className="text-red-500 text-sm">{validationErrors.placa}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="marca"
              placeholder="Marca (máx. 10 caracteres)"
              value={formData.marca}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {validationErrors.marca && <p className="text-red-500 text-sm">{validationErrors.marca}</p>}
          </div>

          <div>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-white ${colorOptions.find(c => c.value === formData.color)?.bgColor}`}
              required
            >
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value} className="text-black">
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="number"
              name="modelo"
              placeholder="Modelo (solo enteros positivos)"
              value={formData.modelo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              
            />
            {validationErrors.modelo && <p className="text-red-500 text-sm">{validationErrors.modelo}</p>}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
