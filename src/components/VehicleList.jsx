import { useState, useEffect } from "react";
import axios from "axios";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/vehiculo/obtener-todos`)
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los vehículos:", error);
        setError("No se pudieron cargar los vehículos.");
        setLoading(false);
      });
  };

  
  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
  };

  
  const handleEditVehicle = () => {
    fetchVehicles(); 
  };

  
  const handleDeleteVehicle = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) return;

    axios
      .delete(`${import.meta.env.VITE_API_URL}/vehiculo/eliminar/${id}`)
      .then(() => {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id)); // Filtrar lista
      })
      .catch((error) => {
        console.error("Error al eliminar el vehículo:", error);
      });
  };

  
  const getColor = (color) => {
    const colors = {
      "1": "bg-red-500",
      "2": "bg-blue-500",
      "3": "bg-green-500",
    };
    return colors[color] || "bg-gray-500";
  };

  if (loading) return <p className="text-center text-gray-500">Cargando vehículos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">🚗 Lista de Vehículos</h2>

      <button
        onClick={() => setShowAddVehicle(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Agregar Vehículo
      </button>

      {vehicles.length === 0 ? (
        <p className="text-center text-gray-500">No hay vehículos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{vehicle.marca} - {vehicle.placa}</p>
                <p className="text-gray-600">Modelo: {vehicle.modelo}</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full ${getColor(vehicle.color)}`}>&nbsp;</span>

                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setShowEditVehicle(true);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showAddVehicle && (
        <AddVehicle onClose={() => setShowAddVehicle(false)} onAddVehicle={handleAddVehicle} />
      )}

      {showEditVehicle && selectedVehicle && (
        <EditVehicle
          vehicle={selectedVehicle}
          onClose={() => setShowEditVehicle(false)}
          onUpdateVehicle={handleEditVehicle}
        />
      )}
    </div>
  );
};

export default VehicleList;
