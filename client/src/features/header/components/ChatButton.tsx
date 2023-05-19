import messages from '../../../assets/icons/messages.svg';

export default function ChatButton() {
  return (
    <div className="relative">
      <button
        id="chatButton"
        className="flex self-center text-sm rounded-full md:mr-0 "
        type="button"
        onClick={() => {}}
      >
        <img
          className="w-10 h-10 rounded-full"
          aria-label="Go to chat"
          src={messages}
          alt="message"
        />
        <span className="absolute top-1 right-1.5 md:right-2 p-1 translate-x-1/2 bg-red-500 border border-white rounded-full text-xs text-white" />
      </button>
    </div>
  );
}
