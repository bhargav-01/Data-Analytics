import React from "react";

export default function Widget({ id, onRemoveItem, component: Item }) {
    return (
          <Item id={id} onRemoveItem={onRemoveItem} />
    );
  }