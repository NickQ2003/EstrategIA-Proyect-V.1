import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('renders login form correctly', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByText(/Bienvenido a/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ingresar al Sistema/i })).toBeInTheDocument();
    });

    it('does not render role field', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Role field should not exist
        expect(screen.queryByLabelText(/Rol/i)).not.toBeInTheDocument();
    });

    it('displays loading state on form submission', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /Ingresar al Sistema/i });
        fireEvent.click(submitButton);

        // Button should be disabled during loading
        expect(submitButton).toBeDisabled();
    });

    it('navigates to main menu after successful login', async () => {
        vi.useFakeTimers();

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        const submitButton = screen.getByRole('button', { name: /Ingresar al Sistema/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Fast-forward time
        vi.advanceTimersByTime(1200);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/menu');
        });

        vi.useRealTimers();
    });

    it('has required fields', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);

        expect(emailInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });
});
