import { useEffect, useRef, useState } from 'react';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import stores from '@/stores';
import { getBackground, getGradient } from '@/systems/utils';

export default function Instructions({ children }) {
  const optionsElem = useRef();
  const { options } = stores.useTraits();
  const [current, setCurrent] = useState(0);
  const last = options.length - 1;

  useEffect(() => {
    optionsElem.current.style.transform = `translateY(-${current * 200}%)`;
  }, [current]);

  return (
    <div className='instructions'>
      <div ref={optionsElem} className='options'>
        {options.map((option, index) => {
          return <Section key={index} option={option} count={index} />;
        })}
      </div>

      <button
        className={`controls prev ${current === 0 ? 'hidden' : ''}`}
        onClick={() => setCurrent(current === 0 ? 0 : current - 1)}>
        <MdOutlineKeyboardArrowUp size={20} />
      </button>

      <button
        className={`controls next ${current === last ? 'hidden' : ''}`}
        onClick={() => setCurrent(current === last ? last : current + 1)}>
        <MdOutlineKeyboardArrowDown size={20} />
      </button>
    </div>
  );
}

const Section = ({ option, count }) => {
  const { traits, setTrait } = stores.useTraits();
  const [hovered, hover] = useState('');

  return (
    <div className='section' style={{ top: `${count * 200}%` }}>
      <h1>_{option.type}</h1>
      <div className={`option-picker ${option.type}`}>
        {option.values.map((value, index) => {
          const selected = traits[option.type] === value;

          return (
            <button
              key={index}
              className={`option-${index} ${selected ? 'selected' : ''}`}
              onPointerEnter={() => hover(value)}
              onPointerLeave={() => hover('')}
              style={{
                background:
                  option.type === 'color'
                    ? getGradient(
                        value.rgb,
                        selected ? true : hovered === value,
                      ).gradient
                    : option.type === 'background'
                    ? getBackground(value, selected ? true : hovered === value)
                        .background
                    : '',
                textTransform: 'lowercase',
              }}
              onClick={() => setTrait(option.type, value)}>
              {value.name.replace(', ', ' - ')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
