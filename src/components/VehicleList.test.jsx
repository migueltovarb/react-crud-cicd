
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VehicleList from "./VehicleList";
import axios from "axios";


vi.mock("axios");

describe("VehicleList Component", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        axios.get.mockResolvedValueOnce({ data: [] }); 
        render(<VehicleList />);
        expect(screen.getByText(/Cargando vehículos.../i)).toBeInTheDocument();
    });

    it("renders error message when API call fails", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error al obtener los vehículos"));
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText(/No se pudieron cargar los vehículos./i)).toBeInTheDocument();
        });
    });

    it("renders 'No hay vehículos disponibles' when the list is empty", async () => {
        axios.get.mockResolvedValueOnce({ data: [] });
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText(/No hay vehículos disponibles./i)).toBeInTheDocument();
        });
    });

    it("renders a list of vehicles when API call succeeds", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
            { id: 2, marca: "Honda", placa: "XYZ789", modelo: "2019", color: "2" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
        render(<VehicleList />);
        await waitFor(() => {
            mockVehicles.forEach((vehicle) => {
                expect(screen.getByText(`${vehicle.marca} - ${vehicle.placa}`)).toBeInTheDocument();
                expect(screen.getByText(`Modelo: ${vehicle.modelo}`)).toBeInTheDocument();
            });
        });
    });

    it("adds a new vehicle to the list", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });

        
        const newVehicle = { id: 2, marca: "Honda", placa: "XYZ789", modelo: "2019", color: "2" };
        fireEvent.click(screen.getByText("+ Agregar Vehículo"));
        
        mockVehicles.push(newVehicle);
        expect(mockVehicles).toContainEqual(newVehicle);
    });

    it("deletes a vehicle from the list", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
    
        
        vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });
    
        
        axios.delete.mockResolvedValueOnce({});
        fireEvent.click(screen.getByText("🗑 Eliminar"));
    
        
        await waitFor(() => {
            expect(screen.queryByText("Toyota - ABC123")).not.toBeInTheDocument();
        });
    
        
        vi.restoreAllMocks();
    });

    it("opens and closes the edit vehicle modal", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });
    
        
        fireEvent.click(screen.getByText("✏️ Editar"));
        expect(screen.getByText(/Editar Vehículo/i)).toBeInTheDocument();
    
        
        screen.debug();
    
        
        fireEvent.click(screen.getByText(/Cancelar/i));
        expect(screen.queryByText(/Editar Vehículo/i)).not.toBeInTheDocument();
    });

    it("updates the vehicle list after editing a vehicle", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
    
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });
    
        
        fireEvent.click(screen.getByText("✏️ Editar"));
        expect(screen.getByText(/Editar Vehículo/i)).toBeInTheDocument();
    
        
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2021", color: "1" }, 
            ],
        });
        fireEvent.click(screen.getByText("Guardar cambios")); 
        await waitFor(() => {
            expect(screen.getByText("Modelo: 2021")).toBeInTheDocument();
        });
    });

    it("logs an error when deleting a vehicle fails", async () => {
        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
    
        
        const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });
    
        
        vi.spyOn(window, "confirm").mockReturnValueOnce(true);
    
        
        axios.delete.mockRejectedValueOnce(new Error("Error al eliminar el vehículo"));
    
        
        fireEvent.click(screen.getByText("🗑 Eliminar"));
    
        
        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith("Error al eliminar el vehículo:", expect.any(Error));
        });
    
        
        consoleErrorMock.mockRestore();
    });

    it("renders AddVehicle component when 'Agregar Vehículo' button is clicked", async () => {

        const mockVehicles = [
            { id: 1, marca: "Toyota", placa: "ABC123", modelo: "2020", color: "1" },
        ];
        axios.get.mockResolvedValueOnce({ data: mockVehicles });
    
        render(<VehicleList />);
        await waitFor(() => {
            expect(screen.getByText("Toyota - ABC123")).toBeInTheDocument();
        });
    
        
        fireEvent.click(screen.getByText("+ Agregar Vehículo"));
    
        
        expect(screen.getByRole("heading", { name: /Agregar Vehículo/i })).toBeInTheDocument();
    
        
        fireEvent.click(screen.getByText(/Cancelar/i));
    
        
        expect(screen.queryByRole("button", { name: /Guardar/i })).not.toBeInTheDocument();
    });


    
});