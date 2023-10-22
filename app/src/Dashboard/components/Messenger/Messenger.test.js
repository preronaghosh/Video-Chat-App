import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageDisplayer from './MessageDisplayer';
import Messenger from './Messenger';


describe('messenger component tests', () => {
    test('test if MessageDisplayer component renders correct message', () => {
        const msg = "This is a test message";
        render(<MessageDisplayer message={msg}/>);

        const msgElement = screen.getByText('This is a test message', { exact : true}); // exact = true by default 
        expect(msgElement).toBeInTheDocument();
    });

    /* test disabled 
    test('test messenger component', () => {
        render(<Messenger />);

        const inputElement = screen.getByRole('input');
        expect(inputElement).toHaveValue('');
    });*/
});