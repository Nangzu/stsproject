import React from "react";
import "../css/inputfield.css";
import {CgSmileNone } from "react-icons/cg";

const InputField = ({icon : Icon, label, iconSize, type, value, placeholder, onChange}) => {
    return (
        <div className="input-configurator">
            <label className="text-wrapper-2">{label}</label>
            <div className="input-field">
                <div className="icon-front">
                    {Icon ? <Icon size={iconSize}/>: <CgSmileNone/> }
                </div>
                <input
                    type={type}
                    value={value}
                    className="regular-input-double"
                    placeholder={placeholder}
                    onChange={onChange}
                    required
                />
                <div className="icon-before">
                </div>
            </div>

        </div>
    );
};

export default InputField;
