import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import EditVehicle from "./EditVehicle";

vi.mock("axios"); // Mock de axios

describe("EditVehicle Component - Error Handling", () => {
    const setup = () => {
        const vehicle = {
            id: 1,
            placa: "ABC123",
            marca: "Toyota",
            modelo: 2020,
            color: "1",
        };
        const onClose = vi.fn();
        const onUpdateVehicle = vi.fn();
        render(<EditVehicle vehicle={vehicle} onClose={onClose} onUpdateVehicle={onUpdateVehicle} />);
        return { onClose, onUpdateVehicle };
    };

    it("logs an error when the API call fails", async () => {
        const { onClose, onUpdateVehicle } = setup();

        
        axios.put.mockRejectedValueOnce(new Error("Network Error"));

        
        const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

        
        fireEvent.change(screen.getByLabelText("Placa"), { target: { value: "XYZ789" } });
        fireEvent.change(screen.getByLabelText("Marca"), { target: { value: "Honda" } });
        fireEvent.change(screen.getByLabelText("Modelo"), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText("Color"), { target: { value: "2" } });

        
        fireEvent.click(screen.getByText("Guardar cambios"));

        
        await screen.findByText("Guardar cambios"); 

        
        expect(consoleErrorMock).toHaveBeenCalledWith("Error al actualizar el vehículo:", expect.any(Error));

        
        expect(onClose).not.toHaveBeenCalled();
        expect(onUpdateVehicle).not.toHaveBeenCalled();

        
        consoleErrorMock.mockRestore();
    });

    it("shows an error if 'placa' exceeds 6 characters", () => {
        setup();

        
        fireEvent.change(screen.getByLabelText("Placa"), {
            target: { value: "ABCDEFG" }, 
        });

        
        fireEvent.click(screen.getByText("Guardar cambios"));

        
        expect(screen.getByText("Máximo 6 caracteres")).toBeInTheDocument();
    });

    it("shows an error if 'marca' exceeds 10 characters", () => {
        setup();

        
        fireEvent.change(screen.getByLabelText("Marca"), {
            target: { value: "MarcaMuyLarga" }, 
        });

        
        fireEvent.click(screen.getByText("Guardar cambios"));

        
        expect(screen.getByText("Máximo 10 caracteres")).toBeInTheDocument();
    });

    it("shows an error if 'modelo' is not a positive number", () => {
        setup();

        
        fireEvent.change(screen.getByLabelText("Modelo"), {
            target: { value: "-2020" }, 
        });

        
        fireEvent.click(screen.getByText("Guardar cambios"));

        
        expect(screen.getByText("Debe ser un número positivo")).toBeInTheDocument();
    });

    it("does not show errors for valid inputs", () => {
        setup();

        
        fireEvent.change(screen.getByLabelText("Placa"), {
            target: { value: "ABC123" },
        });
        fireEvent.change(screen.getByLabelText("Marca"), {
            target: { value: "Toyota" },
        });
        fireEvent.change(screen.getByLabelText("Modelo"), {
            target: { value: "2021" },
        });

        
        fireEvent.click(screen.getByText("Guardar cambios"));

        
        expect(screen.queryByText("Máximo 6 caracteres")).not.toBeInTheDocument();
        expect(screen.queryByText("Máximo 10 caracteres")).not.toBeInTheDocument();
        expect(screen.queryByText("Debe ser un número positivo")).not.toBeInTheDocument();
    });
});