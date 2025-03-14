import { useEffect, useState } from 'react';
import { Input } from 'antd';

interface InputMoneyProps {
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addonBefore?: string;
}

const DECIMAL_SIZE = 2;

// Função para formatar o valor para moeda brasileira
const formatValue = (val: string) => {
  if (!val || val === 'NaN') return '0,00';

  // Remover qualquer caractere não numérico
  const cleanedValue = val.replace(/[^\d,]/g, '');

  // Dividir valor em partes inteiras e decimais
  const [integer, decimal] = cleanedValue.split(',');

  // Formatar a parte inteira com ponto como separador de milhar
  const formattedInteger = integer ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';

  // Limitar a parte decimal a 2 casas
  const formattedDecimal = decimal ? decimal.slice(0, DECIMAL_SIZE) : '00';

  return `${formattedInteger},${formattedDecimal}`;
};

const InputMoney = ({ value, onChange, addonBefore = 'R$', ...props }: InputMoneyProps) => {
  const [currentValue, setCurrentValue] = useState<string>('0,00');
  const [caretPosition, setCaretPosition] = useState<number>(0); // Posição do cursor

  // Atualiza o estado sempre que o valor externo (value) mudar
  useEffect(() => {
    const valueString = value ? value.toString() : '0';
    setCurrentValue(formatValue(valueString));
  }, [value]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Remover qualquer caractere não numérico
    const valueWithoutFormatting = inputValue.replace(/[^\d,]/g, '');

    // Atualizar o valor formatado
    const formattedValue = formatValue(valueWithoutFormatting);
    setCurrentValue(formattedValue);

    // Atualiza o valor no onChange (passando o valor sem a formatação)
    onChange({
      ...event,
      target: {
        ...event.target,
        value: valueWithoutFormatting, // Passa o valor sem a formatação
      },
    });
  };

  const handleCaretPosition = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const position = input.selectionStart || 0;
    setCaretPosition(position);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // Restaurar a posição do cursor ao perder o foco
    const input = event.target;
    input.setSelectionRange(caretPosition, caretPosition);
  };

  return (
    <Input
      addonBefore={addonBefore}
      value={currentValue}
      onChange={handleOnChange}
      onSelect={handleCaretPosition} // Captura o movimento do cursor
      onBlur={handleBlur} // Ajusta a posição do cursor ao perder o foco
      {...props}
    />
  );
};

export default InputMoney;
