import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import BasicInfo from '../components/BasicInfo';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import CreateGeneralQuotation from './CreateGeneralQuotation';
import CreateCAQuotation from './CreateCAQuotation';
import CreateElectricInvoiceQuotation from './CreateElectricInvoiceQuotation';
import CreateInsurranceQuotation from './CreateInsurranceQuotation';
import api from '../../../lib/apiClient';
import * as NotificationActions from 'components/Notification/notification.actions';
import css from '../styles/createQuotation.css';
import { TEMPLATES_SERVICE, TABLE_SERVICE_TYPE } from '../Constants';
import { isEmpty } from '../Utils/checkIsEmpty';
import { validate } from '../Utils/validate';
import { fetchQuotationOfOneCustomer, updateTotalActiveQuotationOfCustomer } from '../quotation.action';

export const CreateQuotation = (props) => {
  const { visible, clearHighlight, notifySucess, notifyError, isHistoryOverview, refreshListQuotation, 
          updateTotalActiveQuotation, overviewType, organisationUUID, data, isEdit, visibleEdit, onCloseEdit } = props;
  const isMounted = useRef(false);
  let defaultTemplate = isEdit ? data?.template : undefined;
  let defaultQuotationName = isEdit ? data?.quotationName : undefined;
  let defaultBasicInfo = isEdit ? data?.customerInfo : {}; 
  let defaultData  = {
    servicePack: [
      {
        id: 0,
        new: true,
        quantity: 1,
        priceService: 0,
        priceDevice: 0,
        priceTotal: 0
      }
    ]
  }
  let defaultServiceData = isEdit ? data?.serviceData : {};

  const [listTemplates, setListTemplate] = useState([]);
  const [template, setTemplate] = useState(defaultTemplate);
  const [nameQuotation, setNameQuotation] = useState(defaultQuotationName);
  const [basicInfo, setBasicInfo] = useState(defaultBasicInfo);
  const [errors, setErrors ] = useState({});
  const [servicesData, setServicesData ] = useState(defaultServiceData);

  useEffect(() => {
    fetchTemplate();
  },[])
  
  const fetchTemplate = async () => {
    try {
      let res = await api.get({
        resource: 'quotation-v3.0/quotation/templates'
      });
      let initialTemplate = res.filter(item => item.name === TEMPLATES_SERVICE.GENERAL)[0];
      setListTemplate(res);
      if(!isEdit) {
        setTemplate(initialTemplate); 
      }
    } catch(err) {
      console.log("err: ", err);
    }
  }

  //h??m l??u b??o gi??
  const onDone = () => {
    //validate t??n b??o gi??
    if(nameQuotation && nameQuotation.length > 255) {
      setErrors({
        basicInfo: {
          isError: true,
          message: 'T??n b??o gi?? kh??ng ???????c qu?? 255 k?? t???'
        }
      });
      return;
    }
    if(!nameQuotation || nameQuotation.trim() === '' ) {
      setErrors({
        basicInfo: {
          isError: true,
          message: 'T??n b??o gi?? kh??ng ???????c ????? tr???ng'
        }
      });
      return;
    }

    //pass validate t??n b??o gi??
    let quotationRequest = {
      uuid: data?.uuid,
      name: nameQuotation,
      quotationTemplateUUID: template.uuid,
      organisationUUID: organisationUUID
    };

    let quotationDetailTypeList;

    //validate y??u c???u c?? ??t nh???t 1 b???ng(cho CA v?? HDDT)
    let isEmptyQuotation = true;
    for(let key in servicesData) {
      if(servicesData[key].filter(item => !item.delete).length > 0) {
        isEmptyQuotation = false;
      }
    };
    if(isEmptyQuotation) {
      setErrors({
        genneral: {
          isError: true,
          message: 'B??o gi?? ph???i c?? ??t nh???t m???t th??ng tin g??i c?????c'
        }
      });
      return;
    }
    
    //validate c??c g??i c?????c
    switch(template?.name) {
      case TEMPLATES_SERVICE.GENERAL: {
        const requireProperty = ['serviceId', 'connectionType', 'productionName', 'quantity'];
        if(servicesData.servicePack.length === 0) {
          setErrors({
            servicePack: {
              isError: true,
              message: 'B???ng b??o gi?? ph???i c?? ??t nh???t m???t g??i c?????c'
            }
          });
          return;
        } else {
          let resultValidate = validate(servicesData.servicePack, requireProperty);
          if(resultValidate.isError) {
            setErrors({
              servicePack: {...resultValidate}
            });
            return;
          }
        }
        //pass validate
        let quotationDetailRequestList = servicesData.servicePack.map(item => {
          let {priceTotal, id, ...others} = item;
          return {...others}
        })
        quotationDetailTypeList = [
          {
            type: null,
            quotationDetailRequestList
          }
        ]
        break;
      }
      case TEMPLATES_SERVICE.CA: {
        let requireProperty = ['connectionType', 'monthToUse', 'hthmCode', 'quantity'];
        if(Array.isArray(servicesData.usb)) {
          if(servicesData.usb.length > 0) {
            let resultValidate = validate(servicesData.usb, requireProperty);
            if(resultValidate.isError) {
              setErrors({
                usb: {...resultValidate}
              });
              return;
            }
          }
        }

        if(Array.isArray(servicesData.sim)) {
          if(servicesData.sim.length > 0) {
            let resultValidate = validate(servicesData.sim, requireProperty);
            if(resultValidate.isError) {
              setErrors({
                sim: {...resultValidate}
              });
              return;
            }
          }
        }

        if(Array.isArray(servicesData.hsm)) {
          if(servicesData.hsm.length > 0) {
            let resultValidate = validate(servicesData.hsm, requireProperty);
            if(resultValidate.isError) {
              setErrors({
                hsm: {...resultValidate}
              });
              return;
            }
          }
        }

        //pass validate
        let tables = [
          {
            name: 'usb',
            type: TABLE_SERVICE_TYPE.USB_TOKEN,
          },
          {
            name: 'sim',
            type: TABLE_SERVICE_TYPE.SIM_CA,
          },
          {
            name: 'hsm',
            type: TABLE_SERVICE_TYPE.HSM,
          },
        ]
        quotationDetailTypeList = tables.filter(table => servicesData[table.name] !== null).map(table => {
          let quotationDetailRequestList = servicesData[table.name].map(item => {
            let {priceTotal, id, ...others} = item;
            return {...others}
          });
          return {
            type: table.type,
            quotationDetailRequestList
          }
        })
        break;
      }
      case TEMPLATES_SERVICE.HDDT: {
          let servicePackRequireProperty = ['hthmCode', 'numberOrder', 'quantity'];
          let costsRequireProperty = ['productionName'];
          let hsmRequireProperty = ['connectionType', 'monthToUse', 'hthmCode'];

          if(Array.isArray(servicesData.servicePack)) {
            if(servicesData.servicePack.length > 0) {
              let resultValidate = validate(servicesData.servicePack, servicePackRequireProperty);
              if(resultValidate.isError) {
                setErrors({
                  servicePack: {...resultValidate}
                });
                return;
              }
            }
          }

          if(Array.isArray(servicesData.costs)) {
            if(servicesData.costs.length > 0) {
              let resultValidate = validate(servicesData.costs, costsRequireProperty);
              if(resultValidate.isError) {
                setErrors({
                  costs: {...resultValidate}
                });
                return;
              }
            }
          }

          if(Array.isArray(servicesData.hsm)) {
            if(servicesData.hsm.length > 0) {
              let resultValidate = validate(servicesData.hsm, hsmRequireProperty);
              if(resultValidate.isError) {
                setErrors({
                  hsm: {...resultValidate}
                });
                return;
              }
            }
          }
          //pass validate
          let tables = [
            {
              name: 'servicePack',
              type: TABLE_SERVICE_TYPE.SERVICE_PACK,
            },
            {
              name: 'costs',
              type: TABLE_SERVICE_TYPE.COSTS,
            },
            {
              name: 'hsm',
              type: TABLE_SERVICE_TYPE.HSM,
            },
          ]
          quotationDetailTypeList = tables.filter(table => servicesData[table.name] !== null).map(table => {
            let quotationDetailRequestList = servicesData[table.name].map(item => {
              let {priceTotal, id, ...others} = item;
              return {...others}
            });
            return {
              type: table.type,
              quotationDetailRequestList
            }
          })
          break;
      }
      case TEMPLATES_SERVICE.BHXH: {
        let requireProperty = ['connectionType', 'timeToUse', 'hthmCode', 'quantity'];
        if(Array.isArray(servicesData.servicePack)) {
          if(servicesData.servicePack.length === 0) {
            setErrors({
              servicePack: {
                isError: true,
                message: 'B???ng b??o gi?? ph???i c?? ??t nh???t m???t d???ch v???'
              }
            });
            return;
          } else {
            let resultValidate = validate(servicesData.servicePack, requireProperty);
            if(resultValidate.isError) {
              setErrors({
                servicePack: {...resultValidate}
              });
              return;
            }
          }
        }
        //pass validate
        let tables = [
          {
            name: 'servicePack',
            type: TABLE_SERVICE_TYPE.NULL,
          }
        ];
        quotationDetailTypeList = tables.filter(table => servicesData[table.name] !== null).map(table => {
          let quotationDetailRequestList = servicesData[table.name].map(item => {
            let {priceTotal, id, ...others} = item;
            return {...others}
          });
          return {
            type: table.type,
            quotationDetailRequestList
          }
        })
        break;
      }
      


    }

    //save b??o gi??
    let submitData = {
      quotationRequest,
      quotationDetailTypeList
    }
    handleSave(submitData);
  }

  const handleSave = async (submitData) => {
    try {
      let res = await api.post({
        resource: 'quotation-v3.0/quotation/create-or-update',
        data: submitData
      });
      if(res) {
        let message = data && data.uuid ? 'C???p nh???t th??nh c??ng' : 'T???o b??o gi?? th??nh c??ng';
        notifySucess(message,'', 2000);
        onClose();
        //refresh list b??o gi??
        if(!isHistoryOverview) {
           refreshListQuotation({
            organisationId: basicInfo.uuid,
            pageSize: 999,
            order: false
          })
        } else {
          updateTotalActiveQuotation({});
        }

        // callback && callback();
      } else {
        notifyError('???? c?? l???i x???y ra','', 2000);
      }
    } catch(error) {  
      console.log('error: ', error);
    }
  }

  const onClose = () => {
    if(isEdit) {
      onCloseEdit();
      return;
    }
    clearHighlight(overviewType);
  };

  //ch???n template
  const handleChangeTemplate = (template, text) => {
    switch(template?.name) {
      case TEMPLATES_SERVICE.GENERAL: {
        setServicesData({});
        setTemplate(template);
        setNameQuotation('');
        setErrors({});
        break;
      }
      case TEMPLATES_SERVICE.CA: {
        setServicesData({});
        setTemplate(template);
        setNameQuotation('B??o gi?? d???ch v??? CA');
        setErrors({});
        break;
      }
      case TEMPLATES_SERVICE.HDDT: {
        setTemplate(template);
        setServicesData({});
        setNameQuotation('B??o gi?? d???ch v??? HDDT');
        setErrors({});
        break;
      }
      case TEMPLATES_SERVICE.BHXH: {
        setTemplate(template);
        setServicesData({});
        setNameQuotation('B??o gi?? d???ch v??? vBHXH');
        setErrors({});
        break;
      }
    }
  }

  useEffect(() => {
    if(isMounted.current) {
      if(template === undefined) return;
      fetchTemplateData(template);
    } else {
      isMounted.current = true;
    }
  },[template])

  //get data template
  const fetchTemplateData = async (template) => {
      try {
        let response = await api.get({
          resource: 'quotation-v3.0/quotation/generate-data',
          query: {
            templateUUID: template.uuid,
            organisationUUID: organisationUUID
          }
        });
        if(response) {
          
          const { organisationDTO } = response;
          const {customer, code, address, email, am, amPhoneNumber, amEmail } = organisationDTO;
          let newBasicInfo = {
            nameCustomer: customer,
            taxNumber: code,
            addressCustomer: address,
            email,
            nameAM: am
          }
          switch(template.name) {
            case TEMPLATES_SERVICE.GENERAL: {
              setBasicInfo(newBasicInfo);
              setServicesData(defaultData);
              break;
            }
            case TEMPLATES_SERVICE.CA: {
              let usb = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.USB_TOKEN)[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index, priceTotal: item.priceService + item.priceDevice};
              });
              let sim = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.SIM_CA)[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index, priceTotal: item.price};
              });
              let hsm = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.HSM)[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index, priceTotal: item.price};
              });
              let newServicesData = {
                usb: [...usb],
                sim: [...sim],
                hsm: [...hsm]
              };
              setBasicInfo(newBasicInfo);
              setServicesData(newServicesData);
              break; 
            }
            case TEMPLATES_SERVICE.HDDT: {
              let servicePack = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.SERVICE_PACK)[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index, priceTotal: item.price};
              });
              let costs = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.COSTS)[0].quotationDetailRequestList.map((item,index) => {
                return {...item, id: index};
              });
              let hsm = response.quotationDetailTypeList.filter(item => item.type === TABLE_SERVICE_TYPE.HSM)[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index}
              });
              let newServicesData = {
                servicePack: [...servicePack],
                costs: [...costs],
                hsm: [...hsm]
              };
              setBasicInfo(newBasicInfo);
              setServicesData(newServicesData);
              break;
            }
            case TEMPLATES_SERVICE.BHXH: {
              let servicePack = response.quotationDetailTypeList[0].quotationDetailRequestList.map((item, index) => {
                return {...item, id: index, priceTotal: item.price};
              });
              let newServicesData = {
                servicePack: [...servicePack],
              };
              setBasicInfo(newBasicInfo);
              setServicesData(newServicesData);
              break;
            }
          }
        } else {
          notifyError('???? c?? l???i x???y ra','', 2000);
        }
        
      } catch(err) {
        console.log("err: ", err);
      }
  }

  //thay ?????i t??n b??o gi??
  const handleChangeNameQuotation = (name) => {
    setNameQuotation(name)
  }
  

  //xo?? to??n b??? 1 b???ng
  const  handleDeleteAllTable = (type) => {
    let newServicesData = {
      ...servicesData,
      [type]: servicesData[type].filter(item => {
        if(item.new) return false;
        return true;
      }).map(item => {
        let {update, ...others} = item;
        return {...others, delete: true};
      })
    };
    setServicesData(newServicesData);
  }

  //th??m row trong b???ng
  const  addServices = (type) => {
    let length = servicesData[type].length;
    let IdlastItem = length == 0 ? 0 : servicesData[type][length - 1].id;
    let newItem = {
      id: IdlastItem + 1,
      new: true,
      quantity: 1,
      priceService: 0,
      priceDevice: 0,
      price: 0,
      priceTotal: 0
    }
    let newServicesData = {
      ...servicesData,
      [type]: [...servicesData[type], newItem]
    }
    setServicesData(newServicesData);
  }

  //xo?? row trong b???ng
  const deleteServices = (type, id) => {
    let newServicesData = {
        ...servicesData,
        [type]: servicesData[type].filter(item => {
                  if(item.new && item.id === id ) return false;
                  return true;
                }).map(service => {
                  if(service.update && service.id === id ) {
                    let {update, ...others} = service;
                    return {...others, delete: true};
                  }
                  return service;
                })
      };
    setServicesData(newServicesData);
  }

  //thay ?????i th??ng tin d???ch v???
  const handleSelectService = (type, id, value) => {
    let newServicesData = {
      ...servicesData,
      [type]: servicesData[type].map(item => {
        if(item.id !== id) return item;
        return {
          ...item,
          ...value
        };
      })
    };
    setServicesData(newServicesData);
  }
  
  let commonProps = {
    addServices: addServices,
    deleteServices: deleteServices,
    handleSelectService: handleSelectService
  };
  let component;

  switch(template?.name) {
    case TEMPLATES_SERVICE.GENERAL:
      component = <CreateGeneralQuotation servicesData={servicesData?.servicePack} errors={errors?.servicePack} {...commonProps} />
      break;
    case TEMPLATES_SERVICE.CA:
      component = <CreateCAQuotation servicesData={servicesData}  errors={errors} handleDeleteAllTable={handleDeleteAllTable} {...commonProps} />
      break;
    case TEMPLATES_SERVICE.HDDT: 
      component = <CreateElectricInvoiceQuotation servicesData={servicesData} errors={errors} handleDeleteAllTable={handleDeleteAllTable} {...commonProps} />
      break;
    case TEMPLATES_SERVICE.BHXH: 
      component = <CreateInsurranceQuotation servicesData={servicesData.servicePack} errors={errors?.servicePack} {...commonProps} />
      break;
    default: 
        break;
  }

  return (
    <ModalCommon title={data?.uuid ? "Ch???nh s???a b??o gi??" : "T???o b??o gi??"} visible={isEdit ? visibleEdit : visible} onDone={onDone} onClose={onClose} okLabel={data?.uuid ? "C???p nh???t" : "L??u l???i"} noLabel="Hu???">
      { errors?.genneral?.isError && <p className={css.err_msg}>{errors?.genneral?.message}</p> }
      <BasicInfo listTemplates={listTemplates} selectedTemplate={template} data={basicInfo} nameQuotation={nameQuotation} 
        onChangeTemplate={handleChangeTemplate} onChangeNameQuotation={handleChangeNameQuotation} errors={errors?.basicInfo} />
      { ( listTemplates.length > 0 && template !== undefined && !isEmpty(servicesData)) && component }
    </ModalCommon>
  )
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const companyInfo = state?.entities?.organisation?.__DETAIL;
  let organisationUUID = companyInfo?.uuid;
  let isHistoryOverview = state?.entities?.quotation?.quotationOfCustomer?.order
  return {
    visible,
    organisationUUID,
    isHistoryOverview
  };
};

const mapDispatchToProps = {
  clearHighlight,
  notifySucess: NotificationActions.success,
  notifyError: NotificationActions.error,
  refreshListQuotation: fetchQuotationOfOneCustomer,
  updateTotalActiveQuotation: updateTotalActiveQuotationOfCustomer
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuotation);

