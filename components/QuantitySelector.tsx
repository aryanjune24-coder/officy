"use client";

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: (quantity: number) => void;
};

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="quantity-control">
      <button
        onClick={decrease}
        className="quantity-control__button"
      >
        -
      </button>

      <span className="quantity-control__value">
        {quantity}
      </span>

      <button
        onClick={increase}
        className="quantity-control__button"
      >
        +
      </button>
    </div>
  );
}
