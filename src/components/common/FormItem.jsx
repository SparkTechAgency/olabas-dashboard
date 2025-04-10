import { Form, Input } from 'antd';
import React, { useEffect } from 'react'

const FormItem = ({name, label}) => {
    const form = Form.useFormInstance();

    useEffect(() => {
        form.setFieldsValue({ name: '' });
    }, [form]);
    
    return (
        <Form.Item 
            name={name} 
            label={<p>{label}</p>}
            rules={[
                {
                    required: true,
                    message: `Please Enter your ${name}`,
                }
            ]}
        >
            <Input 
                placeholder={`Enter Your ${label}`}
                style={{
                    height: 45,
                    border: "1px solid #d9d9d9",
                    outline: "none",
                    boxShadow: "none"
                }}
            />
        </Form.Item>
    );
}

export default FormItem