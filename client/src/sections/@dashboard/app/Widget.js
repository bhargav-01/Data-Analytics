import React from "react";

export default function Widget({ id, onRemoveItem, component: Item,data }) {
    return (
          <Item id={id} onRemoveItem={onRemoveItem} data={data} />
    );
  }