import { getUniqueItem } from './getUnique';

export const validate = (data, properties) => {
    const errMsg = {
      serviceId: 'Dịch vụ',
      connectionType: 'Hình thức hòa mạng',
      productionName: 'Tên sản phẩm',
      monthToUse: 'Thời gian sử dụng',
      hthmCode: 'Mã HTHM',
      quantity: 'Số lượng',
      numberOrder: 'Số lượng hóa đơn',
      timeToUse: 'Thời gian'
    };
    for(let i=0; i < data.length; i++) {
      for(let j=0; j < properties.length; j++) {
        let property = properties[j];
        if(!data[i][property]) {
          let msg = property === 'quantity' ? 'Số lượng không được để trống nhỏ hơn hoặc bằng không' : `${errMsg[property]} không được để trống`;
          return {
            isError: true,
            message: msg
          }
        }
        if(property === 'quantity' && Number(data[i][property]) < 0) {
          let msg = 'Số lượng không được để trống nhỏ hơn hoặc bằng không';
          return {
            isError: true,
            message: msg
          }
        }
      }
    }
    // let uniqueData = getUniqueItem(data);
    // if(data.length > uniqueData.length) {
    //   return {
    //     isError: true,
    //     message: 'Có thông tin gói cước trùng nhau trong danh sách'
    //   }
    // } 
    return {isError: false}
}