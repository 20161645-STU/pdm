import { Upload, Button, Icon } from 'antd'
import React, { Component } from 'react'
import './style.less'

class Uploads extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    this.setState({
      uploading: true,
    });
    // console.log('fileList', this.state.fileList)
    // console.log('formData', formData)
    this.props.beginUpload(formData)
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div style={{marginTop:'20px'}}>
        <Upload {...props}  multiple>
          <Button>
            <Icon type="upload"/> 请选择文件
          </Button>
        </Upload>
        <div className="uploadButtons">
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? '正在上传' : '开始上传'}
          </Button>
          { this.props.visible === true ? <Button onClick={this.props.prev} style={{marginLeft:'20px'}}>上一步</Button> : null }
          <Button disabled={fileList.length === 0} style={{marginLeft:'20px'}} onClick={this.props.finish}>完成</Button>
          </div>
      </div>
    );
  }
}

export default Uploads
