export default function ChatButton() {
  return (
    <div className="relative">
      <button
        id="chatButton"
        className="flex self-center text-sm rounded-full md:mr-0 "
        type="button"
        onClick={() => {}}
      >
        <svg
          className="w-10 h-10 rounded-full text-primary dark:text-primary-lighter"
          aria-label="Go to chat"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M8 8H16M8 12H13M7 16V21L12 16H20V4H4V16H7Z"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />{' '}
          </g>
        </svg>
        {/* Red dot on chat button */}
        {/* <span className="absolute top-1 right-1.5 md:right-2 p-1 translate-x-1/2 bg-red-500 border border-white rounded-full text-xs text-white" /> */}
      </button>
    </div>
  );
}
