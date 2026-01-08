import { useEffect, useState } from "react";

// Functional requirements
// Forward functionality :
// 1) when there is no digit in the input - apply the new key in it and focus on next input
// 2) when there is digit in the input -
//      a) if cursor is at the beginning - apply new value to the current input and slide the old value to next input
//      b) if cursor is at the right - apply new value to next input and focus on next to next input
// Backward functionality :
// Arrows functionality :

// OtpInput renders a row of single-character inputs and manages
// cursor-aware insertion, shifting, and focus movement for typical OTP typing.
export const OtpInput = ({ size = 4, onSubmit, status }) => {
  // Stores the current digit for each input as strings (either "" or a single character).
  const [inputValues, setInputValues] = useState(() => {
    return new Array(size).fill("");
  });
  const [isVerifying, setIsVerifying] = useState(false);

  // No-op change handler to keep inputs controlled and avoid React's
  // read-only warning when using the `value` prop.
  const handleChange = () => {};

  // Focus helpers
  // Moves focus to the immediate next input if it exists.
  const focusNext = (currentInput) => {
    currentInput?.nextElementSibling?.focus();
  };

  // Moves focus two inputs ahead when possible; otherwise falls back to the next input.
  const focusNextToNext = (currentInput) => {
    if (currentInput?.nextElementSibling?.nextElementSibling) {
      console.log(currentInput);
      currentInput.nextElementSibling.nextElementSibling.focus();
    } else {
      focusNext(currentInput);
    }
  };

  // Moves focus to the previous input if it exists.
  const focusPrevious = (currentInput) => {
    currentInput?.previousElementSibling?.focus();
  };

  // Arrow key navigation: Right → next input, Left → previous input.
  const handleArrows = (event) => {
    if (event.key === "ArrowRight") {
      focusNext(event.target);
    } else if (event.key === "ArrowLeft") {
      focusPrevious(event.target);
    }
  };

  // Backspace clears the current input and moves focus to the previous input.
  const handleBackspace = (event) => {
    if (event.key === "Backspace") {
      const inputIndex = Number(event.target.id);
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[inputIndex] = "";
        return newValues;
      });
      focusPrevious(event.target);
    }
  };

  // Numeric input handling (0-9):
  // - If current input is empty: place the digit in current and focus next.
  // - If cursor is at the beginning: shift current digit to next (if any), overwrite current with new digit, then focus two ahead.
  // - If cursor is at the right/end: write digit into the next input; focus next if it was empty, otherwise skip to next-to-next.
  const handleNumericInput = (event) => {
    const inputValue = Number(event.key);
    if (isNaN(inputValue)) return;
    const inputElement = event.target;
    const inputIndex = Number(inputElement.id);
    if (inputValues[inputIndex].length === 0) {
      // Current input empty → place here and move focus forward.
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[inputIndex] = inputValue.toString();
        return newValues;
      });
      focusNext(inputElement);
    } else {
      const cursorIndex = inputElement.selectionStart;
      if (cursorIndex === 0) {
        // Cursor at start → shift existing char to next, replace current with new digit.
        setInputValues((prev) => {
          const newValues = [...prev];
          if (inputIndex < size - 1) {
            newValues[inputIndex + 1] = prev[inputIndex];
          }
          newValues[inputIndex] = inputValue.toString();
          return newValues;
        });
        focusNextToNext(inputElement);
      } else if (inputIndex + 1 < size) {
        // Cursor at end/right → write the digit into the next input.
        const isNextEmpty = inputValues[inputIndex + 1].length === 0;
        setInputValues((prev) => {
          const newValues = [...prev];
          newValues[inputIndex + 1] = inputValue.toString();
          return newValues;
        });
        // Focus behavior depends on whether the next input already had a value.
        if (isNextEmpty) {
          // When the next input is empty, move focus only to next.
          focusNext(inputElement);
        } else {
          // If next input already had a value, skip to next-to-next.
          focusNextToNext(inputElement);
        }
      }
    }
  };

  // Central key-up dispatcher:
  // Tries numeric input first, then backspace, then arrow navigation.
  const handleKeyUp = (event) => {
    handleNumericInput(event);
    handleBackspace(event);
    handleArrows(event);
  };

  useEffect(() => {
    // Basic validation example: mark invalid if any input is empty.
    // This can be extended to trigger `onSubmit` when all inputs are filled.
    var isValid = true;
    inputValues.forEach((inputValue) => {
      if (inputValue.length === 0) isValid = false;
    });
  }, [inputValues]);

  const isComplete = inputValues.every((v) => v.length === 1);

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    setIsVerifying(true);
    try {
      const otp = inputValues.join("");
      if (onSubmit) {
        await Promise.resolve(onSubmit(otp));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="otp-container">
      <h4>Enter OTP</h4>
      <div className="otp-inputs-container">
        {inputValues.map((value, index) => {
          return (
            <input
              id={index.toString()}
              value={value}
              key={index.toString()}
              onKeyUp={handleKeyUp}
              onChange={handleChange}
              maxLength={1}
            />
          );
        })}
      </div>
      {status && (
        <div className={`form-message ${status.type}`}>{status.message}</div>
      )}
      <button
        type="button"
        className={`btn primary ${isVerifying ? "loading" : ""}`}
        disabled={!isComplete || isVerifying}
        onClick={handleVerify}
      >
        {isVerifying && <span className="spinner" aria-hidden="true" />}
        <span className="btn-label">
          {isVerifying ? "Verifying…" : "Verify OTP"}
        </span>
      </button>
    </div>
  );
};
