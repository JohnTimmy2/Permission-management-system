import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SelectGroup.css";

function SelectGroup() {
  const [group, setGroup] =
    useState("");

  const navigate =
    useNavigate();

  const handleDone = () => {
    if (!group) {
      alert(
        "Please select a group"
      );
      return;
    }

    localStorage.setItem(
      "group_name",
      group
    );

    navigate("/student");
  };

  return (
    <div className="select-container">
      <div className="group-card">

        <h2>
          Group Selection
        </h2>

        <p>
          Please select your
          SE Group
        </p>

        <select
          value={group}
          onChange={(e) =>
            setGroup(
              e.target.value
            )
          }
        >
          <option value="">
            Select Group
          </option>

          <option value="SE Group 1">
            SE Group 1
          </option>

          <option value="SE Group 2">
            SE Group 2
          </option>

          <option value="SE Group 3">
            SE Group 3
          </option>

          <option value="SE Group 4">
            SE Group 4
          </option>
        </select>

        <button
          className="continue-btn"
          onClick={handleDone}
        >
          Continue
        </button>

      </div>
    </div>
  );
}

export default SelectGroup;