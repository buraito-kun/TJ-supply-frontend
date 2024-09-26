export default function CircleImageButton({ ...props }) {
  for (let attribute of []) {
    if (!props[attribute]) throw new Error(`Please specify ${attribute}`);
  }

  return (
    <button onClick={props.onClick}>
      <div
        className={
          "w-[60px] h-[60px] bg-[#001F3F] rounded-full " + props.className
        }
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M47.5 32.495H32.5V47.495H27.5V32.495H12.5V27.495H27.5V12.495H32.5V27.495H47.5V32.495Z"
            stroke="white"
            strokeWidth="1.6"
            fill="white"
          />
        </svg>
      </div>
    </button>
  );
}
