const capitalizeFirstLetter = (text: string) => {
  const newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return newText;
};

export default capitalizeFirstLetter;
