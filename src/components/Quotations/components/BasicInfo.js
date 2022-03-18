import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Grid, GridColumn, GridRow, Button, Form, Input, Icon, Popup, Menu, Label } from 'semantic-ui-react';
import style from '../styles/quotationDetail.css';
import { TEMPLATES_SERVICE } from '../Constants';


const selectTemplateBtnStyle = {
  borderTopLeftRadius: '0px',
  borderBottomLeftRadius: '0px',
  width: '120px'
}



export const BasicInfo = (props) => {
  const { isViewOnly, listTemplates, data, onChangeTemplate, selectedTemplate, onChangeNameQuotation, errors, nameQuotation } = props;
  const [open, setOpen] = useState(false);
  const divEle = useRef(null);
  const popupStyle = {
    padding: 0,
    minWidth: divEle.current ? divEle.current.clientWidth - 0.5 : 200,
    marginTop: 0
  };

  let templateOptions;
  if(listTemplates) {
    templateOptions = listTemplates.map(item => {
      let text;
      switch(item.name) {
        case TEMPLATES_SERVICE.GENERAL:
          text = 'None';
          break;
        case TEMPLATES_SERVICE.CA:
          text = 'Báo giá dịch vụ CA';
          break;
        case TEMPLATES_SERVICE.HDDT:
          text = 'Báo giá dịch vụ HDDT';
          break;
        case TEMPLATES_SERVICE.BHXH:
          text = 'Báo giá dịch vụ vBHXH';
          break;
      }
      return {
        ...item,
        text
      }
    })
  }

  const selectTemplate = (uuid, text) => {
    let selectedTemplate = listTemplates.filter(item => item.uuid === uuid)[0];
    setOpen(false);
    onChangeTemplate(selectedTemplate, text);
  }

  const handleChangeNameQuotation = (event, { value }) => {
    onChangeNameQuotation(value);
  }

  const onOpen = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false)
  }


  return (
    <Grid>
      <GridRow columns={2}>
        <GridColumn>
          <div className={style.formRow}>
            <label>Tên báo giá</label>
            <div className={style.select_template} ref={divEle}>
              {
                isViewOnly ? <Label className={style.label_custom}>{data.nameQuotation}</Label> : <>
                  <Input style={{ width: 'calc(100% - 123px)' }} error={errors?.isError} placeholder="Tên báo giá" onChange={handleChangeNameQuotation} value={nameQuotation} />
                  <Popup
                    open={open}
                    style={popupStyle}
                    onOpen={onOpen}
                    onClose={onClose}
                    hoverable
                    size="huge"
                    basic
                    position="bottom right"
                    content={
                      <Menu vertical style={{width: '100%'}}>
                        {
                          templateOptions && templateOptions.map((temp) => (
                            <Menu.Item key={temp.id} onClick={(e) => {
                              e.stopPropagation()
                              selectTemplate(temp.uuid, temp.text) }}
                                  className={temp.uuid === selectedTemplate?.uuid ? style.menu_active : ''} >
                              {temp.text}
                            </Menu.Item>
                          ))
                        }
                      </Menu>
                    }
                    on="click"
                    trigger={
                      <Button className={style.btnSelectQuote} style={selectTemplateBtnStyle}>
                        Chọn template <Icon name="caret down" />
                      </Button>
                    }
                  />
                  { errors?.isError && <div style={{width: '100%', color: 'red'}}>{ errors.message }</div> }
                </>
              }
            </div>
          </div>
          <div className={style.formRow}>
            <label>Khách hàng</label>
            <div>
              {
                isViewOnly ? <Label className={style.label_custom}>{data?.nameCustomer}</Label> : <Input fluid value={data?.nameCustomer} disabled className={style.input_disabled}/>
              }
            </div>
          </div>
          <div className={style.formRow}>
            <label>Mã số thuế</label>
            <div>
              {
                isViewOnly ? <Label className={style.label_custom}>{data?.taxCode}</Label> : <Input fluid value={data?.taxNumber} disabled className={style.input_disabled} />
              }
            </div>
          </div>
          <div className={style.formRow}>
            <label>Địa chỉ</label>
            <div>
              {
                isViewOnly ? <Label className={style.label_custom}>{data?.address}</Label> : <Input fluid value={data?.addressCustomer} disabled className={style.input_disabled} />
              }
            </div>
          </div>
        </GridColumn>
        <GridColumn>
          <div className={style.formRow}>
            <label>Email</label>
            <div>
              {
                isViewOnly ? <Label className={style.label_custom}>{data?.email}</Label> : <Input fluid type="email" value={data?.email} disabled className={style.input_disabled} />
              }
            </div>
          </div>
          <div className={style.formRow}>
            <label>AM</label>
            <div>
              {
                isViewOnly ? <Label className={style.label_custom}>{data?.am}</Label> : <Input fluid value={data?.nameAM} disabled className={style.input_disabled} />
              }
            </div>
          </div>
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfo);
