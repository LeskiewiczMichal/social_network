interface ScrollToBottomProps {
  animation: boolean;
  refElement: any;
}

const scrollToBottom = (props: ScrollToBottomProps) => {
  const { animation, refElement } = props;

  if (!refElement || !refElement.current) {
    return;
  }
  if (animation) {
    refElement.current.scrollIntoView({ behavior: 'smooth' });
  } else {
    refElement.current.scrollIntoView();
  }
};

export default scrollToBottom;
