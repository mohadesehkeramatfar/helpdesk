import { Button, Form, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import style from './authForm.module.scss';
import Image from 'next/image';

const AuthForm = ({ children, formItems, finishFormHandler, loading }) => {
  const [formName] = Form.useForm();
  return (
    <div className={`${style.form_container}`}>
      <Image
        src={'/image/logo.webp'}
        width={90}
        height={90}
        alt=""
        className={`${style.logo}`}
      />
      <div className={`${style.text_form_container}`}>{children}</div>
      <Form
        onFinish={finishFormHandler}
        name={formName}
        layout="vertical"
        className={`${style.form}`}
      >
        <div className={`${style.field_form_container}`}>
          {formItems.map((field) => {
            return (
              <>
                <FormItem
                  dependencies={field.dependencies}
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  rules={field.rules}
                >
                  {field.component === Select ? (
                    <Select options={field.options} />
                  ) : (
                    <field.component disabled={field.disabled} />
                  )}
                </FormItem>
                {field.showReRequestBtn &&
                  field.children.map((item) => {
                    return (
                      item.component === Button && (
                        <Button
                          type={item.type}
                          onClick={item.onClick}
                          disabled={item.disabled}
                        >
                          {item.text}
                        </Button>
                      )
                    );
                  })}
              </>
            );
          })}
        </div>

        <Button
          loading={loading}
          htmlType="submit"
          type="primary"
          className={`${style.btn}`}
        >
          مرحله بعد
        </Button>
      </Form>
    </div>
  );
};
export default AuthForm;
