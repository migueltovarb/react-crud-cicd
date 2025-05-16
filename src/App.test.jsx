import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
    it("renders the App component", () => {
        render(<App />);
        
        expect(screen.getByRole("main")).toBeInTheDocument();
    });

    
});