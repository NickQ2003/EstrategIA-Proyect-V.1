import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cards from '../Cards';
import { Home } from 'lucide-react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Cards Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('renders card with title and description', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="Test Service"
                    description="This is a test service"
                    path="/test"
                    color="blue"
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('This is a test service')).toBeInTheDocument();
        expect(screen.getByText('Acceder')).toBeInTheDocument();
    });

    it('navigates to correct path when clicked', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="Test Service"
                    description="This is a test service"
                    path="/test-path"
                    color="green"
                />
            </BrowserRouter>
        );

        const card = screen.getByRole('button');
        fireEvent.click(card);

        expect(mockNavigate).toHaveBeenCalledWith('/test-path');
    });

    it('handles keyboard navigation (Enter key)', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="Test Service"
                    description="This is a test service"
                    path="/keyboard-test"
                    color="purple"
                />
            </BrowserRouter>
        );

        const card = screen.getByRole('button');
        fireEvent.keyPress(card, { key: 'Enter', code: 'Enter' });

        expect(mockNavigate).toHaveBeenCalledWith('/keyboard-test');
    });

    it('handles keyboard navigation (Space key)', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="Test Service"
                    description="This is a test service"
                    path="/space-test"
                    color="orange"
                />
            </BrowserRouter>
        );

        const card = screen.getByRole('button');
        fireEvent.keyPress(card, { key: ' ', code: 'Space' });

        expect(mockNavigate).toHaveBeenCalledWith('/space-test');
    });

    it('renders without icon', () => {
        render(
            <BrowserRouter>
                <Cards
                    title="No Icon Service"
                    description="Service without an icon"
                    path="/no-icon"
                    color="cyan"
                />
            </BrowserRouter>
        );

        expect(screen.getByText('No Icon Service')).toBeInTheDocument();
    });

    it('does not navigate when path is not provided', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="No Path Service"
                    description="Service without a path"
                    color="pink"
                />
            </BrowserRouter>
        );

        const card = screen.getByRole('button');
        fireEvent.click(card);

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('is keyboard accessible', () => {
        render(
            <BrowserRouter>
                <Cards
                    icon={Home}
                    title="Accessible Service"
                    description="Keyboard accessible service"
                    path="/accessible"
                    color="blue"
                />
            </BrowserRouter>
        );

        const card = screen.getByRole('button');
        expect(card).toHaveAttribute('tabIndex', '0');
    });
});
