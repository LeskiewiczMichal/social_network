type StandardButtonProps = {
  text: string;
  handleClick:
    | ((e: React.MouseEvent<HTMLButtonElement>) => void)
    | (() => void);
  width?: string;
  bgColor?: string;
  hoverColor?: string;
  textColor?: string;
  border?: string;
  whiteMode?: boolean;
};

function StandardButton(props: StandardButtonProps) {
  const {
    text,
    handleClick,
    width,
    bgColor,
    hoverColor,
    textColor,
    border,
    whiteMode,
  } = props;

  if (whiteMode) {
    return (
      <button
        type="button"
        className={`w-${width} px-4 py-2 border text-black flex justify-center gap-2 border-slate-300 rounded-lg dark:text-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150`}
        onClick={handleClick}
      >
        {text}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`w-${width} bg-${bgColor} hover:bg-${hoverColor} text-${textColor} ${
        border ? `${border}` : ''
      } font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150`}
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
  border: '',
  whiteMode: false,
};

export default StandardButton;
