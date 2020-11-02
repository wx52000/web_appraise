
export const tableSelectCom = {
  data(){
    return {
      checkRowList: [],
      innerVisible: true,
    }
  },
  methods: {
    closeEvt(){
      this.innerVisible = true;
      this.$emit('confirmEvt');
    },
    submitEvt(){
      this.$emit('confirmEvt', true, this.checkRowList);
    },
    // 取消默认选中项(单个勾选)
    /**
     *checkRowList 接口返回的默认勾选数组
     *id 列表唯一标识
     */
    onTableSelect (rows, row) {
      // console.log(rows,'rows',row,'row')
      if (!rows.includes(row)) {
        const index = this.checkRowList.findIndex(item => {return item.id === row.id});
        this.checkRowList.splice(index, 1)
      } else {
        this.checkRowList.push(row)
      }
    },
    // 全选操作
    onTableSelectAll (arr) {
      // console.log(arr,'全选or取消全选')
      if (!arr.length) { // 直接取消选中全部
        this.list.forEach((v) => {
          const index = this.checkRowList.findIndex(i => {return i.id === v.id})
          if (index !== -1) {
            this.checkRowList.splice(index, 1)
          }
        })
      } else { // 直接选中全部
        this.list.forEach((v) => {
          const index = this.checkRowList.findIndex(i => { return i.id === v.id })
          if (index === -1) {
            this.checkRowList.push(v)
          }
        })
      }
    },
    //回显
    _toggleRowSelectionMixin(isCheck = false){
      let _this = this;
      this.list.forEach(e => {
        let rIndex = _this.checkRowList.findIndex(ele => {return ele.id === e.id});
        if(rIndex > -1){
          if(isCheck){
            // 如果列表的值可以改变，需要重新勾选以绑定改变的值
            _this.checkRowList.splice(rIndex,1, e);
          }

          _this.$nextTick(() => {
            _this.$refs.multipleTable.toggleRowSelection(e, true);//这个就是回显的核心
          })
        }
      })
    }
  }
}
