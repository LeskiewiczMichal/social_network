type SeparatorLineProps = {
  text: string;
};

export default function SeparatorLine(props: SeparatorLineProps) {
  const { text } = props;
  return (
    <div className="relative flex py-5 items-center">
      <div className="flex-grow border-t border-gray-300" />
      <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-dark">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
}
