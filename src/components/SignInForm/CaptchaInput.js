import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Icon, Form, Input, Button } from 'semantic-ui-react';
import api from '../../lib/apiClient';
import css from '../../components/Form/FormInput.css';
import { setCaptchaId } from '../Auth/auth.actions';
import { getMessageError } from '../Auth/auth.selector';

 const CaptchaInput = (props) => {
  const { meta, input, label, ...other } = props;
  const { value } = input;
  const { error, touched } = meta;
  const hasError = touched && !!error;

  const handleChange = (event, { value }) => {
    const {
      input: { onChange },
    } = props;
    onChange(value);
  };
  useEffect(() => {
    getCaptchaImg();
  }, []);

  useEffect(() => {
    if (props.messageError === 'INCORRECT_CAPTCHA') reloadCaptcha();
  }, [props.messageError]);

  const [captcha, setCatcha] = useState({
    captchaId: 'hjqc7h7hs6nscedhbbiaj3qcat',
    captchaImg:
      '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',
  });
  const [loading, setLoading] = useState(false);
  const getCaptchaImg = async () => {
    setLoading(true);
    try {
      const res = await api.get({
        resource: `enterprise-v3.0/captchaImg`,
      });
      if (res) {
        setLoading(false);
        setCatcha(res);
        props.setCaptchaId(res.captchaId);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  const reloadCaptcha = async () => {
    setLoading(true);
    try {
      const res = await api.get({
        resource: `enterprise-v3.0/reloadCaptchaImg/${captcha.captchaId}`,
      });
      if (res) {
        setCatcha(res);
        setLoading(false);
        props.setCaptchaId(res.captchaId);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <Form.Field error={hasError}>
      <div style={{ display: 'flex', justifyContents: 'space-between', alignItems: 'center' }}>
        <Input
          value={value ? value : ''}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          onChange={handleChange}
          {...other}
        />
        <img
          src={`data:image/png;base64, ${captcha?.captchaImg}`}
          height={37}
          style={{ minWidth: '40%', width: '40%', marginLeft: '3px', marginRight: '5px' }}
          alt="captchaImg"
        />
        {/* <Button type="button" icon={} /> */}
        <Icon loading={loading} name="refresh" size="large" onClick={reloadCaptcha} />
      </div>
      {hasError && <div className={css.error}>{error}</div>}
    </Form.Field>
  );
};

const mapStateToProps = (state) => ({
  messageError: getMessageError(state),
});

const mapDispatchToProps = {
  setCaptchaId,
};

export default connect(mapStateToProps, mapDispatchToProps)(CaptchaInput);
