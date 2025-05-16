import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import AddVehicle from "./AddVehicle";
import axios from "axios";
vi.mock("axios");

describe("AddVehicle Component - validateForm", () => {
    const setup = () => {
        const onClose = vi.fn();
        const onAddVehicle = vi.fn();
        render(<AddVehicle onClose={onClose} onAddVehicle={onAddVehicle} />);
        return { onClose, onAddVehicle };
    };

    
    it("does not show errors for valid inputs", () => {
        setup();

        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        expect(screen.queryByText("La placa no puede superar los 6 caracteres.")).not.toBeInTheDocument();
        expect(screen.queryByText("La marca no puede superar los 10 caracteres.")).not.toBeInTheDocument();
        expect(screen.queryByText("El modelo debe ser un número entero positivo.")).not.toBeInTheDocument();
    });

    it("shows an error if 'placa' exceeds 6 characters", () => {
        setup();
    
        
        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABCDEFG" }, 
        });

        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });
    
        
        fireEvent.click(screen.getByText("Guardar"));
        screen.debug();
        
        expect(screen.getByText(/La placa no puede superar los 6 caracteres/i)).toBeInTheDocument();
    });

    it("shows an error if 'marca' exceeds 10 characters", () => {
        setup();

        
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "MarcaMuyLarga" }, 
        });

        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABCDEFG" }, 
        });

       
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        expect(screen.getByText("La marca no puede superar los 10 caracteres.")).toBeInTheDocument();
    });

    it("shows an error if 'modelo' is not a positive integer", () => {
        setup();

        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });

        
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "-2020" }, 
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        expect(screen.getByText("El modelo debe ser un número entero positivo.")).toBeInTheDocument();
    });

    it("shows an error message when the API call fails", async () => {
        const { onClose, onAddVehicle } = setup();

        
        axios.post.mockRejectedValueOnce(new Error("Network Error"));

        
        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        await waitFor(() => {
            expect(screen.getByText("No se pudo agregar el vehículo.")).toBeInTheDocument();
        });

        
        expect(onAddVehicle).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    

    it("calls onAddVehicle and onClose when the API call is successful", async () => {
        const { onClose, onAddVehicle } = setup();

        
        axios.post.mockResolvedValueOnce({ data: { id: 1, placa: "ABC123", marca: "Toyota", modelo: "2020", color: "1" } });

        
        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        await waitFor(() => {
            expect(onAddVehicle).toHaveBeenCalledWith({
                id: 1,
                placa: "ABC123",
                marca: "Toyota",
                modelo: "2020",
                color: "1",
            });
            expect(onClose).toHaveBeenCalled();
        });

        
        expect(screen.queryByText("No se pudo agregar el vehículo.")).not.toBeInTheDocument();
    });

    it("shows an error message when the API call fails", async () => {
        const { onClose, onAddVehicle } = setup();

        
        axios.post.mockRejectedValueOnce(new Error("Network Error"));

        
        fireEvent.change(screen.getByPlaceholderText("Placa (máx. 6 caracteres)"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Marca (máx. 10 caracteres)"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByPlaceholderText("Modelo (solo enteros positivos)"), {
            target: { value: "2020" },
        });

        
        fireEvent.click(screen.getByText("Guardar"));

        
        await waitFor(() => {
            expect(screen.getByText("No se pudo agregar el vehículo.")).toBeInTheDocument();
        });

        
        expect(onAddVehicle).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});