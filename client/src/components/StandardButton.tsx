type StandardButtonProps = {
  text: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  bgColor?: string;
  hoverColor?: string;
  textColor?: string;
};

function StandardButton(props: StandardButtonProps) {
  const { text, handleClick, width, bgColor, hoverColor, textColor } = props;

  return (
    <button
      type="button"
      className={`w-${width} bg-${bgColor} hover:bg-${hoverColor} text-${textColor} font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

StandardButton.defaultProps = {
  width: 'full',
  bgColor: 'primary',
  hoverColor: 'primary-lighter',
  textColor: 'white',
};

export default StandardButton;
