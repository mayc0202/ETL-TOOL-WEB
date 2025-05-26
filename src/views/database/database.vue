<template>
  <div class="container">
    <div class="wrap">
      <div class="flex header">
        <i class="el-icon-s-unfold icon" />
        <div class="font">数据源接入</div>
      </div>
    </div>
    <div class="body">
      <el-container>
        <el-aside width="260px" class="page-aside">
          <div class="group">
            <div class="wrap">
              <div class="flex search">
                <el-input
                  v-model="searchGroup"
                  placeholder="输入分组名称"
                  clearable
                >
                  <i slot="prefix" class="el-input__icon el-icon-search" />
                </el-input>
                <div class="add">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    style="padding: 10px"
                  />
                </div>
              </div>
              <el-button type="primary" class="queryAll" @click="queryAll()">查看全部数据</el-button>
              <el-tree :data="group">
                <div slot-scope="{ node,data }" class="custom-node flex between">
                  <div class="flex node-label">
                    <img v-if="data.type === 'GROUP'" :src="group_icon" class="group_icon">
                    <img v-else :src="database_icon" class="group_icon">
                    {{ node.label }}
                  </div>
                  <el-tooltip v-if="data.type === 'GROUP'" effect="dark" placement="right" :popper-class="&quot;menu-tooltip&quot;">
                    <i class="el-icon-more node-icon" />
                    <template #content>
                      <div class="custom-menu">
                        <div class="menu-item" @click="addGroup(data)">新增分组</div>
                        <div class="menu-item" @click="editGroup(data)">编辑分组</div>
                        <div class="menu-item" @click="deleteGroup(data)">删除分组</div>
                      </div>
                    </template>
                  </el-tooltip>
                </div>
              </el-tree>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <div class="list">
              <div class="flex between search">
                <div class="search_input">
                  <input
                    v-model="databaseName"
                    placeholder="请输入数据源名称"
                    class="input"
                  >
                </div>
                <div>
                  <el-button type="primary" icon="el-icon-search">查询</el-button>
                  <el-button type="primary" @click="openFlowDialog()">数据源接入</el-button>
                </div>
              </div>
              <template>
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  max-height="640"
                >
                  <el-table-column
                    fixed
                    type="index"
                    label="#"
                  />
                  <el-table-column prop="flowName" label="数据库名称" width="300" />
                  <el-table-column prop="group" label="分类" width="280" />
                  <el-table-column
                    prop="description"
                    label="数据库类型"
                    width="300"
                  />
                  <el-table-column
                    prop="createdTime"
                    label="创建日期"
                    width="180"
                  />
                  <el-table-column fixed="right" label="操作" width="140">
                    <template slot-scope="scope">
                      <div class="wrap">
                        <div>
                          <el-button
                            type="text"
                            size="small"
                            @click.native.prevent="
                              deleteRow(scope.$index, tableData)
                            "
                          >
                            查看
                          </el-button>
                          <el-button
                            type="text"
                            size="small"
                            @click.native.prevent="
                              deleteRow(scope.$index, tableData)
                            "
                          >
                            编辑
                          </el-button>
                          <el-button
                            type="text"
                            size="small"
                            @click.native.prevent="
                              deleteRow(scope.$index, tableData)
                            "
                          >
                            删除
                          </el-button>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <div class="pagination-wrapper">
                <el-pagination
                  :current-page="currentPage4"
                  :page-sizes="[10, 20, 30, 40, 50, 100]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="100"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <database-dialog
      :title="databaseDialog.title"
      :visible="databaseDialog.visible"
      :width="databaseDialog.width"
      :height="databaseDialog.height"
      :show-bth="false"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-container>
          <el-aside width="200px" class="dialog-aside">
            <div class="wrap">
              <div class="flex">
                <i class="el-icon-s-unfold database-icon" />
                请选择数据库类型
              </div>
              <div v-for="(item, index) in databaseType" :key="index">
                <div class="item hand" @click="selectDbType(item)">
                  <div class="flex">
                    <img :src="item.icon" :width="item.width" :height="item.height">
                    <div class="item-name">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-aside>
          <el-main>
            <el-main class="dialog-main">
              <el-row
                v-for="(row, rowIndex) in Math.ceil(databaseList.length / 3)"
                :key="rowIndex"
                :gutter="parseInt('20')"
              >
                <el-col
                  v-for="item in databaseList.slice(rowIndex * 3, (rowIndex + 1) * 3)"
                  :key="item.id"
                  :span="8"
                >
                  <div class="database-block hand" @dblclick="selectDatabase(item)">
                    <img :src="item.icon" alt="">
                  </div>
                </el-col>
              </el-row>
            </el-main>
          </el-main>
        </el-container>
      </div>
    </database-dialog>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog/Dialog.vue' // 导入组件

export default {
  name: 'PagePermission',
  components: {
    'database-dialog': Dialog
  },
  data() {
    return {
      group_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABKhJREFUWEfFlmtsVFUQx3+zW8rDovJIEFugRUKURzAUBETLLhZMjPAFQY0P6JYWZZGHHwhffMVE/CjikmxLt0WDRhINiiJSocsiEighyktDaIsIxZhAeUgq0L0jZ7e7bLt3+1gBz7d7Z+b8f3dmzpwr/M9L/ou+q1xdJj5YIsF090kLwFWhqxDeBTKMsMLXKvhDRbK1uyDdAnAHdKnCG8BAOyGFL1Xxh4ple1dBugQwrUJLRFgJjOjKxgqbFPwhj+zszL9DAFeFvoCwHJjQ2UYpMvKpWvhDCyWUKt4WwF2ls9XiNaAwHeH2MQoft2bkp/a2NgDTq7TAigo/cyuEk0CEgBXGv3uh7I/Z4gCugJYDC2+HsE1GynZ5ZJF5HwFwVWgxwvo7IR7XUFYEi+WDCIA7oE8qbLtTAAKNCouCHvkmXgJ3leZbFqUOWKCQeTtgIsJKeTgT/+6X5Gy8BIliBeX6kGTwoliYsgy6FSARYaEsnEFZTDipCdsLFW7QoeEWlliCV6BPOiB2X5zyGFbX6xKFlQKbezpYXZAbTZFrvY7BiRflla5CKJwXZW1iqr9r0Nwe8JbCo8D7M/KkMl6C7fU6V4RNiQKWxTu9nfhjINMq9XGxWIYwp0MQYaNTeW+HR44Zv5rTmtNyndeBFYlxCkUz86Qq0oR2ABE64bTCmqYrfDhvtFyLZCSgTyOUosxqAyJsQSkznW3ebzqqmf3uYqnAMlVybGbBTQBj/KFeS4FSFfJtvvAggm9GrgRitlaQ57C4jPBtTNjYq0+qB8ULjLep+RYclBUOi4Im3QXbG3SZoQbybKhDovhmDJc25Yr5VdfrPI02bUGSsHAUWF2YKxsTbUkAqpp9Pcyqc82MOnKOB2+k9X6bjGwV5StnD3b+00KLE1wCc4GnknyFxjEDOD6wD/syHKwRiTZ3bN0cRAGdNGkIb5eMJ3N4f6a3Olw8dYnQ8SbyU4Ck7kehcfQAjg3OYjKQZRzrmggGDnLhxz94M1Qkh+MlMFNQLQ7Edpucw2/Lp3BmUBZPtL6ra7jAz3UXmdIpiNA4qj+HBvdlrEC2iW+8xJ6Pasnee4rcmIbTybgd8+VQh5fRzBHsfXUi1+7txTQTGFb2NzTx+8nLTE0CERpH9uPAkLt5QGC08T/fTG35AfpsOxF9brMSLyNjcFdqmSoldjmdO4ZtL4/jnqxMphi7ws4T5/nr5EUmOBxcHdaXo3n9yHFKZMhw5TpHPvmF5s8PM9FuPxHKa4rEnLq2p8BdpVOx8Co8bxc4/2G2PjuWQb0z4ke1ziQGGGn8r1k0bP6VM/5aHrM0eQeBz3Dgq1kge5KaMNG99Xo257jtsIk6XVj8CLtnjSS3Vw/Gtgof39XA2bX7yL98Ndpw7dYWAV+NR75vb+jwp9RdoXPMuTYVsstI9t2cNhk4c4lhdnYzic3cqCmWL1LYkweRnaMroPMhAmJbU5uYWsAX9MiGVMIdliBVkKtCvSIsvvHfP8q2ueCYKuuCxeLrTDgtABPk8mkWPfGKk8WqDI10snBKw6zjKr6gV/7uqnjSKehOoKtS7xNltmXRLE6qg0XyZ3fi085AOiIdxfwLqTmyMA+O74MAAAAASUVORK5CYII=',
      database_icon: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAB6CAYAAABwWUfkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEU5RUY5NUMzNENGMTFGMDkyOTRFODkwODI4MEZDMjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEU5RUY5NUIzNENGMTFGMDkyOTRFODkwODI4MEZDMjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDJFMzkxRDAzNEJDMTFGMEJFNjE5MDExNENCRERGQzYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDJFMzkxRDEzNEJDMTFGMEJFNjE5MDExNENCRERGQzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5gvsqJAAAhr0lEQVR42uxd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',
      group: [
        {
          value: '1',
          label: '关系型数据库分组',
          type: 'GROUP',
          children: [
            {
              value: '4',
              label: 'MySQL测试库'
            },
            {
              value: '5',
              label: 'PostgreSQL测试库'
            }
          ]
        },
        {
          value: '2',
          label: '数仓分组',
          type: 'GROUP',
          children: [
            {
              value: '4',
              label: 'StarRocks测试库'
            },
            {
              value: '5',
              label: 'Doris测试库'
            }
          ]
        }
      ],
      // 弹框属性
      databaseDialog: {
        title: '数据源接入',
        visible: false,
        width: 880,
        height: 380
      },
      searchGroup: '', // 查询分组
      databaseName: '', // 数据源名称
      tableData: [], // 数据源列表
      currentPage4: 10,

      databaseType: [
        {
          id: 1,
          name: '关系型数据库',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAzpJREFUSEu1lV9oU3cUxz8nTZukMYmNDpO6PXRVOukelPlgdVPWsT8oODp93YMKQxjsYVTYxt4GOqwgImMTdTB81U1hKsjY2jk6YYztYdIKdiJqcyvoTG5j0qa5Z9wb43aTe5PMst/b/Z3v+X3OOb/zO1dosowHOigBtikMAKuB5UBZISPKpMI4Qb5NR+WXRkeJn3HG1B2WxQcirG8WzCP7mCoj6YSc99LXgVRVZkxOArtaBNTKjqXisrd20wXKqiaLJmcVXnpCSMVN+KGjxFAyKdnqOY9BdiZ3TcYWDfknwtFUXF6uAxk5PQHsWVQm9c7HU3F5p5IkYOR0O3CuGeRe0WI6bzmy7miAZeFAMxcbMLQiLmcd0ExOLyu86OV16dY8524U+f72PH/NqUvSFRIGn+7gzZ4wrz3T4Qe9korLgBhZ3YDws5fqy4kCH12ZbRq1Ldi/YQm710Q8tVaZLTboE4SPvRRmSfn01zwnJwoNYXvWRPjwhShL2r2fpcBBMUz9DuUVr5MO/ZZn+qHFW8+G6QzCnbz7jtYuD3LTtPj6zyLdnQGG10U9A1K4LEZObwMr/UCHfn/omFZGA/QmgqxKtDnf17NlprILDtxew2s7fUF2v9mgBaDiXbMKC8pnfxQ4M1XkRq7sGW1PvI0dvWHefT5CJOg70Uo2yN1K/zrOLt39OWVnb4hwmzCVK7vau29pkNmSxempOZIhaZSRA7oLPNWsdLF2cd5OOlpJPpOvQO2GaaF00zKT058UNvm11VeTBb64WmhYur39Ebb3hOgK+T7gUcnkdERg2C+j9jahPxl0RkjtHdh3aOdz9f4CpbI2Kt0BmTZ1c0AZ8wKdulZk37jpMvUtrZTu2gN3c4xsjPF2X9izMAIbq7NunMoftG4tdgQJ/LgiLlv+96GqytZ0Qi4+bvxMVj8Xoe7P6NckLe0LR1Mxec/Wul6YkdVLCK+2dEgTkcLFdFy2VmUu0C3VSMcs36jy+iJhF+7FGOoXmfcEVTeNrB5BcFL+z0s5nErI+7V+vsPJMHVQlX0Cb7QCU+UCFiPpLhn10vuCquKMqf0o2wQGFJ4TSD2yZYBJgfGycL47JhONAvobMlZQZ4b0CnkAAAAASUVORK5CYII=',
          width: 32,
          height: 32
        },
        {
          id: 2,
          name: '非关系型数据库',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABU1JREFUaEPdmmtsVEUUx39z7+6WtlRrQKRg2RpfIIgoRSo+GjDGWowfEGN8QYLBxAAmgmiMEREVojxMBD8ZScBEY0A/mYrRUB4qECBBHhYwBlqogDwk0NJ2u/eOzrDb7MI+7txtl+IkdzfZPXPm/M/MnOcVdMOQUoaBamAMMBwYn4ZtPbAP2P4fzUYhRGOuywu/DKSU/YCpwHRgqE8++4HPgFVCiNN+eBgDiGl7DjDLz4IZ5iwHlgghmkz4GgGQUs4D3jVZwAftPCHEe17neQIgpawEVgBjvTLOkW4bMEMIsTMbn6wApJQvAKuzMeqh/6cIIb7IxDsjACnlbGBpDwnnle0cIcSydMRpAfQS4eNypwWREsAVPjbplJ3yOF0GQEo5GtjhdX/zTDdGCJEkWyoAW/NobUzxbxNCVCVOSgIgpXwbWGDK1S+90/QrkQ2LCI1/C7s8Sa5MLN8RQnTJ2AVASjkE8BmbSJzGLbh/7cQ98TvOkW3I9rPItrNaEFFYiuhTil0+FuuG4ViD7sEOj6NlXlGXoMVvNiMKr/Oqi4p4HJUI4BPT8CC660uie9cSPbjO68Ip6QpqFxOsmmHCY7kQ4hWtHPURC8xOeeWgNBz5fi7O0e656/bgSkK1i/UOGYz+KgCMA/DssJzGX2hbWQPSMVjLA6mwKJz2A3b4fg/EmkT7hjiABq8hcdvnj6BA9MRQwhe++KNX1vuFEMNELDw+7HVW4sXzOseEru+CCybkFQrAFJVQeJ3VywBMVQBUIjHzKgWwQgFYnyGHvQyX2gHleKJ71uCeOugVd0Y6q98tBEY+TaT+AwyPUL0CIE2kiAMIjplOZMNCovu+RbZ6tsBJS4ni/gSGTyJU/QadO1b6AYAvAPbNEwhVv45d8RCy9aQG4R7bjXuyAff4HmSkNa1OrAHDdNhglY3Uwovi63EObyKy8SOcP9eb7oA/AHHprLK7sG+qJjC0VoOJD9l+DnnhtH7cM4foWKuKFxAY9Rx9JqkiBFro6P46nEMbcY/91jXX8AjlCKA0jOw4j2w7g+g7AOVRRclARElZ7BlI5+YlOE0qwBUE7pwMkVac5h3Ilr9T7lJeARTNbsA9sY/2r5+HaLvJVUpLmxcAdsWDOIc3E3rgVdx/GvUdyHUEbq8leqDO1x3wZUbtIVV0/DQftzlr5SMrttDD88Ht9GOFtBk1dmTKDyjtEyzSobS2Qke34548kFVYRWCVhrEGjyYwdKIO3pQ5jfz8sR8A2pH5CiXURQ2MeJLAsMe7LJC+0Kf+oKP+fZxYjhC89yWsQXcjivphlZShzKgC3mWJGr4juvcb5Plj+jfDO6BDCVVZzimYswaOJDjqGazyKuTZJtrXXDSbwcppFExchuxoQUbOg/5uwT2ylc5dX+Ee333ZjhkCqMgpnO7z1CodTqgQoDuGr3BaLWxSxLqY0DwK0qVw2jrteTvq5uYuv7A1P78Jjar1ew5odEpZN1c7pO4Y9o2VhB7LIaWM7ULek/rAbTUERkwmMOpZUz0kJ/UxAEaXOXFFea6Z1iW36p+sa8shVJyhrHIH1qDR2OH74jUFU+EVfTjeCLm0sOWrgZGYpRW9vAUV5PXgSGqA5FxadA5tom31E+BECI6bRUHNhz0oO5lLi7GjpLoxqovoeagjFKlfSKhmEaLgGs/zfBBWXtq1+f+V1+NaMfENPjRpOsWswdHLQPhrMSWAuHqbfAkgVNfm0zw2PlSbdeal3ZhU5y5rmzXJYeWnAZLUwMh2WYwAxMysaoS8ZtpLyCYIoBKrpaYvgBgDSDhWV+fLHqk0eSVft/kX4XJnu4jUn2QAAAAASUVORK5CYII=',
          width: 32,
          height: 32
        },
        {
          id: 3,
          name: 'MQ服务',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAwtJREFUSEu9lk9oXFUUxr/vvk4K2bgSsTZoQBAUs1E3QWizsUp0USRBQRftvElJqYKdO0RBsFkFO3cSUrS2mTfBjRRSkFJFxS4SF22zkG5q3FhqoS6kBRGEhiZ592tnkrEzk3mPNA15q8c5532/e/7cwyO26eE2cbAloMitvA+YtwQtiebkUJ6XWhNoCyo7DRF6V9D3ORuU0rIul+KIYrYxhuB7Wctvmm0tKl+N6ZlMRn+umW8wZk92hP8lwaKSfoP0QqNf0KmcDYZTQVFJA5Bm6kFS3JcrZOYSQc7/DeCJZj+/Di0PpILKJ7SbSxoHMLAWOBda07daTv8KwGcFXTDG/EyPO56Yac0I4NHQciIV1OiMiv4miN01G/kThV+8VuaN2bHHS28TeHHVh4sQngPwL8FS1vLUhoahHlQuLu8lg1lgfSmqMZHz1RIPKGZXboR/pQ1N6nhXnC4IuBJajiT3SJ9D3oSFoLAp0LTT8x5aiFeWew59vPNqkkhlXC97r+mcNT2bAkVOhwEVQmu6I6fzgHbJ+xM0wRiAXgCXBIx2duLs4h39s7zM7uFPeCMJlli6ynG9JqoSFkxXuRgfI83T9DgjgyNxgENBjNMe+HJHB674Jd0KAnYf+GgToLVmi4p7s4XM5cTSOb0q6HRoTdOlfaipqzjNC1qs3qOUCzsL6Fxog8mH6tFqmfgZhNsgHge5UBUwwuBBy9/rYlFR/TA6CeF62kHq8U09miqu7Dc03/5/MnKhCvDQMQD7CFz20jzJPQD2PhDRFDvMp/HdpScfCzr+GDzKxdTSRc7PNgrcf6+tn1q/iuoX8RTkdwF+rrr/Iud/BfBSi+g1gh9mLX9MXEFTJfUa6WI9wEPDQzZYt06a1pTzatsbcjDM82zb0lWN5eLdHjIzSXIim+f5tAZXnN4Q9EMC6Iswzw8SQWnCrb6yi/MEXftveC603L8loOmS3vTSd+1AkkZzhaA6RLXnkf8ZIhefAfhOKyy0pkn7kUG1iSzpIKTXAQSSrjZmsmUZbbSnW5LRRmD3ANppQiqTk+6fAAAAAElFTkSuQmCC',
          width: 32,
          height: 32
        },
        {
          id: 4,
          name: '文件服务',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAddJREFUWEftl8FLFGEYxn/PrgxtEhhpQmRBYmlbh0jIKMNO0aFTIIF/gN68dBRK9OatQ0UE3QsSgiQPEtSh9VCZ1aVLBEWQUXnQxVLfdoRZZqZd19hv3ct8h4GPme95fvPADO8j6rxUZ39KApjZdeAocBrYXyXkC+A18FDSTFzrHwAzywGnqjQtd3xY0o3wzQiAmb0DsjUyD2QvSnoSbIoAZjYE3KqxeSB/UtIrfxMGmAeObxPAHUmDRQAz2w382CZz3+alpO4wQB/wNABYX5wnn+vHlj9FmBrarrCj+54TTkkb6W9czCwCkH9+gbXvz0oapRoPocz/fZnpll68zpGIXkUAeU1o50Enb7v6ZZJMz31STSeKepsCLE930nBgAJRyArD+a47UriN42fGtASw93of9/unEPBDxDl/Fy44lAEkCSQJJAkkCW0sgn7vM2tcpp7/izJkp0nvPlwXoAD6EHf98vIutLDiBSDf3km4+G9b6LKktPpJ9A1qcOFYWeSCpPw7wqDAqXap81skTo4WByO8ekaHU7wJ+J6j1mi2M5T2BSbwX+FTXakjwXtKxsH6pZtQOTADngD2OYN4CNyXdjuttWk7NrKtQVlqrhHgjqex4Vfd2/BdW/+0hT10DKwAAAABJRU5ErkJggg==',
          width: 32,
          height: 32
        },
        {
          id: 5,
          name: '对象存储',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAkxJREFUSEvtlE1oE1EQx/+T7kYpLX4gIuihRTCYXXvJQQQFBRFPggf1oF7Eg6JYRPCwL8VIsikFERHUkx5EQVCEnqR40ENFhOAH5KWHRhDFg60g1ENJdveNLKYhX7ubVOlB3Nvy5j+/mXnzf4QV+miFOPgPwrbMwgZd79/P4ASBUiD+SEyvPeW+mxlbPRt0FT2NzrTdUwrqMoESAQmfauxc+JDu/9p63jXIyFUfgehYd8sTOy9F363G2K5Ahu1cB3CxO0gtijRDWlRa0kSCzHz1LDPd7gnyO3haCn1P1yDDdvyqti8DBFbqamlsVcbXduwoMcGDcQ+bPXi7iPneciA1zZQU+sGOoGS2kqFY7EpocsJLMA0BPBRRxIIU+po2kJmrnmSi++Fi+iSFNpy0nUsEXIvqVoFTMyL+tj66HePVlFJUCBUyvldcbWs5QwsjE7zFc90vUSBCZVNRDHyrgwzbuQFgNMTZiwwclkKfWoox8+4DZj4eCCNIaelm0+gM25kEcChYREekpT1pPDfHnQOsUAe3aZnvynT8dG8g4DnAZVY856+smXX2+gk4hhfBxWm7pUWvWkGho6sbT2Gf8n4USF/3M+x+iGKjRavvZpthjTwnwa4MF+Nx0dKPmjnvDJO6ExYrhd7k0aafsM1jYL4k9I3JzNwA9LWFoBecmB8W0/ETrUW0vQz+7JmQZcIwgPUEzAI8LUX8nC+uGdp3+86GZO8J9EYBkyWhPevUaeSjGjYefwKLXPlctgbno/0UFfGXzv+oo15q+PdAvwDhwNIb46dA3AAAAABJRU5ErkJggg==',
          width: 32,
          height: 32
        }
      ],
      // 数据源列表
      databaseList: [
      ],
      // 样例数据
      simpData: [
        {
          id: 1,
          type: 1,
          name: 'MySQL',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 2,
          type: 1,
          name: 'PostgreSQL',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 3,
          type: 1,
          name: 'Oracle',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAABACAYAAAD72BWUAAAAAXNSR0IArs4c6QAAHzdJREFUeF7tXQe4LUWR/ltZVlFyEgOg5IxkUOBJWIJKWILkqKRFXLKrSPIBEiSDAiICoouCJAkiIAgCii5BRdFVFxEFFVfW7LL09n+7z3vn3jtzpqsmnDlzur7vfA+9Hapreqa6qqv+MhgCWWBBAAsDWAjAHENgYdCULwP4HYDfGOD5tvBmvbxWags/FfLxIoCnjZf5WJEF5gOwG4CdALwFwOLcdwB+BuBeAFcY4IdjJRQAFlig7/uwaPjveQA8MkKyeNEAj2bxa4HlACwmWMuzBvixoH1qWiCB8AxeB8CMiLCsAe6ritdaF22BlQFsDWBzAK8PLzAV2CjRf4eP8a8APADgVgM81PQCLLCjU/xfbHreBuf7Iw8AAJ4MSu+eLis9C7zHvROXAqBCG0SXATjcAH9q8Fk0PpUFNoGXyc7wB6JRp90N8Lkcxf8pAPsLFniRAQ4VtE9N/QHy1QA2BfA2AEsBeFM4YC8yggK6wBlHh8XyHQzFxQzwRFafyhW/BbaE/20D4M2xjI5YuxcAfJmHAAC3G4BKq1YaA8WfJT96XD4D4FQD/E+tAm5wcAucBOB4wZQ8DM0w3hvQGbLABsHbQYUvsYDbLoPbDPDOPCYtcDmA/QSLSIo/UlgWeAOA7YPBuVVkt7Y3+zmAFQzw5yJGrT9QHgtgmdD2DwD+HcBR/d/QyhS/BT4A4Ljgvi/ir2t/PxPAaQagd6AWGlPF35MlrwFONsB5tQi3wUGtd+1fo5jyewA2NMDvFX1b1cUC7wJwCoBVW8VYNczQCFjeAM8OUPzJ4q9G1rNGscAOAD4EYI2Kh27DcJsZ4O4iRixwbfCYZTXl4WGLnhe1tOIPJwxaL7yfHGfiB5kHgHMM8JeqBTHmir8nzp/Sk2SA71ct3ybGs94DRt7pgtTQVQbYW9OxDX0sMIMHZADrtYGfmng4yACXDBo7WfzVSd4CGwE4y3lf165u1FaN9GkTcS1kgQ+Gd2sQ848Z4K1soFb8FtiWLlgAK7ZKTMNnhrEAxxuAp/rKKCn+WaKky397A9xTmXAbGsgCd4U7xzIzRp3+y0xQdV8LrBUs/H+qeuyWjXef8YebgWT9tyHd8RcJasDfrdc7p8N7j7pKv2RAd5GXz/o4IQZJx9D7qJtUit/6e9eRtTxipFNBmwe5Katy/yfFP+2J7G+AT1fwnBoZwvr3he9NWWLEPz8GlXuVyjKW1d8CMwF8uI6xWzYmn8fKBqBXqkjxpzv+IiENVvqHu6DYs0sMMSpd6d28pYhZC7wD8YbQhAdBpPhD+tFNbhK6VxIVS+BHDDIxwE+KmxZ+LLoe1a8R0V4GuFrTsck+FmAUMdPy5q9o3jNdoM8xFY1VyzDBCmFQUVcCrIrkdKSJVEbJ4i8SZfbfLfAad6XMwz4zP7pOnzc+HqiQQoYQ37UYusMAW0UrfuvzjG8HsGzM6KnNLAkw4I+C/mYZmSSLP1N6fwOwfl6+dBl5V9nX+qhaRq5XRf8HYB0D/EdVA1Y5TsiRZsYLU6jGgZivv7YB+FwKyXrltW9hw9kNxj6qP8THcE+tIJDbqDZlMPMysdgmIW3+u5GLPd0AH4xS/BZYH97lQOCdRDoJ7GaAz+u6TuSkJos/W3jPAXirAfhv68h6HAt+sKqmR00LI5itx+y4HsDcVS+4xeMx1SoaaCkF98meZMgCYSZMEeaFbOD2tt7VeGMhmqw3LNeJ6LCiAX5QqPhDEAUHfW3EoKnJYAkwKO1GjZCS4h8otetcpD/R71pF1r8zPwDwxpoY48mdAU6tIOvT877loov/sRUMNcPECQY4WTJVsvjjpWWBLZxCu82l874ivtdItyRAnDhg0fpMmSJguVkgQAMVf4DW/Y6DDl2iJlEyt5C/KBdZTTz0D0t5EEikB35Q9ZQEYNjAAI9LB1YofgYb8SPcZpoXwOoVMbhm21zfDnr2fADvr2h9WcP8NQT6FQaU1cjDxNDWvze8eiAMapVEABKmyvLKjP/aKgcvOdYLxuePiyhZ/HHisv5amTDNVVv6xFogCBt/3F9tIe5tWvsq76UFDnHouBflLIZeR3qdJ4DQihQ/sYGrCuSjkOkCvMEx8KOY6NdhPg3rIYaZd024R8I+blgi/7p/KTzoUEn9VrI+heJ/yrmLlpfMMay21rusmV/Ke0/KW0NfMR4xshVkgXUdguXDDTBDaGPuz6FRgEa9n/u6Iia+Cn8t9iUTn6ZU0dT1D5OC+4plbAEaBd8GsHRx68IWNF65pwi5/kAX91RPAi6eiN/8I8J3lIdxrvkLBvhsv5RyFb/iVJonfd5VXDaKeddTF2QB5iETgKQsOtSDRqjgFIqfhysWAxkpsn7TflzJ9MYG+Lqyb6XdrAfqaQrjYj8DXFHpAgSDWV9DgjEoZYgHYV5bXF5VCmwZZursq/i2jl1wn4NzvjPUeCnzKIiX8Im2eQLLLKiqvpmK3/qCEBeUnISnrEOdFdaE1VOSVVl3C+wC4IxQ9EHWeXZrVl6LxuseF8VP8YRTK71DUsVJC1HsetU+wLx+1uPwE49fSoQc5dWAFLeeLnBGAYu8SFLmstpb4COEUy4x1i/CYZr5xby66DwlxT/4Ebu0PSKgHlViI9D7RLc291aiDAlMU/zW3+f/Vwlp8W75sKqR60rwU0tXC7wqQPSWqZrFNL87YhgcJ8UflD/3IYvTzBUjn9Dmj2bI0eTh0MKAPik9YoB1rC8w8iVpZxbiMMCuin7qLsI0oqx5mCm0S0zxETWTLeyYFH/+Q7EeerdMbNIxxh8cEg2QQJbivxLAXkqpPRMAa1hQZCzIAnu6qG26lOZULPhxF+UfFdymUPw/dmVBRxpzwQIHOOt3IO55hsxZiIJuwsbJVd3j+0TERikWPYNbV+vVIHARujwMMppZSo2u3foMFUJ3a4jlhg807QrW06xD3CdF9Q9U/LyL30wsVB8Lsm2VNesVPIxMl0mK31X3ITgCrSwNMZWAEIONuxs1zFbZJ5xSGTW5sGLcHY0PehxICsU/knf8U4WgUILnuztiVopsnCxwMICLFRNPgGr0+jmLkHXDn1IEk9K1yZzyJspEM5CPwVcaOtwA52o6dqFPsvizn6L1AdSaGB3u+80lWApd2Edl1jBV8dPFSFejlGjhE0lsJPDDpYuLaW89eAI3rTSHmcAfxF5/edA8CsU/8hY/5WF9pD4RI2PpIWfxs857o2SBRQH8pwLvIhN7P7LaVtYaLzT1phBOzOlAvb7ivBuaojssr3xCow+nZZMliz9X8ceC0PQPwDTPNUy56+mW7ZD62Zml+EMFLeZMSonwgqs74H+6+ceahJjJ/bLa2wBXJcU/XQKhPgRf7lh62gBLxjauqp0FWMNiG8V4M7Lck664zRwuUp4HamlmBnOBiRVRW1CtqzL4dpfiygAqKV1vykf/S+dsXfuk+DPfcx4ieZiU0P8CYCZPEXCNZMyxaNuv+K9VFj/Y0PhcwUTeEmJKkrSASqF1rrD4O+Hq56ay/lAZjX5nSpSb1mxil7pH1MAvKPpeY4A98voFqGzGDEjpSQOsJO0U295h8TPHnpktEqJRsdG4RO4PEkxy9Wcqfo0HaR8DMCYtkVACE4rfAq8MCEavFvY/w7n3jxX26XTzYKkxqlsKPLG8i8rmvW4mKRR/4WFiVB6EA/i5GcC7Bfwu3FSsSQAa4XOjq19CDEZayrnlCWyVSwqwl95YYijZGOaV3wpaZkw3fDpmjq63SRb/5CccAKCIoEc9FEs3GWC72Map3WQJ9BS/xs1C9+uSPQjAJNjZElDWXh+YhjLmip9oj5KXfBED/KaJPamw3npssSY2q7QNpHDVwdgBaYGsl0LsCEtDV0YBxErqkj3XoaWxhnoib2il6nx9O8H6Mrv0OMcS46EYxFrp3o6dvAvteor/QgD/IlzQWEfmDpKV9QUlaAVKrP77HbphLjzymCt+4krE1ougwpuziTQxC2wM4F7he8PmDxtf8TKKLLCPW78GmU80Twwz1mOBExM8logNTgNBEqcRO/ZItkuKf/Jjsx5OdnfBwyQSLFN9Eykl0FP8TId4g2CMXxu5a1Mw/Og3tR6V73LhShbMq8GsUPyduONXBPc94yzpxYVyVzW3PopfU3N+WQP8WDKp9RkjTHeS0sEG+KS0U15769HQJN+Kma5OPdH9EgUJKLxEnYbstf5QOJ9ggwy8FhWMM7ZNjYtGZnEUVtWSUDpxFUgr3P1yQxeWPu4bai8DXJ01tELxd+KO3wLvcEFh9wg25wQCnqC9qqlDbvwYdPEtqrt3F1DH6H5G+TPaX0LM6V/aAM9LOuXsQU3u/tquzKg2378sy63snyz+2Y/FAjNcZP7XBA8qGvRMMObYNaXi3z8gz0kW/y4DELAm0QAJuE1NNzDdwbGUCz6jUPxdsfgJ6yqpT32JK2t5UKzANe0cYh3RFh9V9C31TFzg6EwAH1bMe7PRI+zNmk6BpPgL48GIEvVJIFn8kxT/kQ774izBBmHas+baSzBFa5o+K/UMxnJOxX+iizeRAGoQpGc+A/w9dpJxbWd9oQkJbnRukRmF4h95i195KN3O+Jz6WihEtRNLXFOhcf0y+fXWg0MxY4TloqW0kwGuk3bqb6/4VlzsgiylsUNlWByJvsnin6T4z0YK/Mzat4TxJiie1Bsf9Q5Q8RMz+71RrX2jbxlfazxRgQQUwV+5sh03xR9ga6nkXiPYaHxZ5qmz6IviMNdjv5LrMYVrtDc/Xf3LlalFbn3dBElQ1b4OTOkzguc3Fk2T4p+k+Fm2/T1j8eBlizzLAEfLusS3puKny37r+C64zhUTIWBJomLFTwQ5QrLGUq5rVKH4S7mVYxmuo124zyYgzqrC8e92YFKaAh9R01iPCMhaFlK8CypdBiSxfG5pcjU1tGBbpQ4fCnRC4qffVXrBHRsgufonKf77COzUsUdcdjnMYlqxTgh8Kv7HWBlMwGnKyRUIywqrj+Whzo2L4rf+lHuGQMT9TfczNd7/OahaKrFNFbzt7JD0vqjol9nFAq8LdQEk3pDeWETP08DtMv+c6HtrCdbBj5emRLFgitFrmhT/JMXPXPxlRu8p1srxpi61WxLQLGaGip/V9CTgIEcbWTCGmKkudbDAswBeL1jTG43vM4kUin+k7viDNU23n/YaiadkRq/T3V85KUGZyMedDktcU2J34Brce3uoe28vUCyUHiiCn/xN2leRyjdvAviaLuXk6p+k+InqKM1UkW7dUWp/lQH2rpthKn4G671KMNFBRl4jXTB8t5o6hc0ULAluOj/KrNhXVvHnuvot8HEATM0aNv2DK2O7CICFhHm8WXyXDl7LE4b1PPKZzC8U2F/DvfrPhf2imiss8N64pxpFdoDUSGi6ZkKU0FrQKFn8kxQ/i0ol8hIg2ijjcGoHu6LiJ362BPDkRPdCn5SeVJwEpB9LAAtkPfgqLX4LzOXuz1mCuXJLNE4qlbf6ngFWqXzUMKCyKA17H2kARi3XQhZYGcATQqwI8kJ0Q1bU/L6EMcUhNtN7JZmzi22TxT9J8T+nqHPRxW3BNe1hgGuaWBwVP8t3Styrn3RgIAc3wdyozxEK9tCVFUsvGYBW8DSqUvFz8AArTES398Uy19J2hIRdr667ZCU2PUVFpbpaXVcPvWdhgfMAHKZ4NkwTWksCbWyBr0IWPJnAe7Lf5YTVP/tQLY0xU2z1kehSy5Vg3sqp+KUFUG40wPYjIcohM+lO9vSkSCqS/cwAb2lC8fcpDpYQJgqdBGFwyJKdNT3v8xkIw8jgyskCrw1589ElgQMTtebg9i808Ej4Xwb8SUlUb8MCBE/ZUzDJNgYgAFOiPgkki3+2MCxwu6tdseWYbxBetxPGm3DYjRAV/ycgQzpLaFyRj8YC20AGJvOgAd7WpOLnXBb4Z3e3xBrrc0YurS3N6o7iPx/A+xWLPccFtR2h6KfqovAG9eYRfXBc+dTTAfCgGEsqeOLYwUe1XVL8kxS/1Psxqo99EN9HGOCcJhdGxX+8s/akd/YrS+8Hm1xUW+ZSHKquN8COTSv+oPx53cNyq/O2RX4D+OAd9T513odZYD0ADyo8ITy18/ROpdoYOX7vUMZsRLsYLfCvbn9IPlAJ7CtjByTFP0nxnwLgQ429KO2biFduROirJRspb7lU/FKrlGMNrB3fPtkOhyNFKt9x7o6fL8I0Ulh14nQ+CywLf48rCfZsWrgvuKJSdCFTKddCITaDd/SUh5S2MMCd0k5l21uA1xGsFkhYXylFBRVZD7QiuVZhxPaiDraX0cqJggSS4p+k+GnoSDAuUoxZBW8SFT9BQF4E8ErBePe6e1VWTUuUIwELLB/uhyUyWjMPm7kJxU9GrU+to/XYhnS/qbJjauTWBnhGIlRpW+vLyJ4s7ccPmAF2VvSrpIsF/s1d15yqGIyHKaYR8d9cCnUK+K2QAAflVpxU8NmJLknxT1L8Uv3DVDceJiVB053YN1UuYiKgS4lItopzS/NDnChDAoqCJs85fITF8oSpUPxqyN6Q7kdYWElVvDr3AaFuT2kCOEp5YOPa/xQAhJieNDSyHlJ4BQUDUcAhFiCUsgSy+y4DbK7gp7NdUh7/5EfrPElEqZMYkjsYn46cSCmBnuKXlkbkdCm6P0fo1iMhEiFtbsFzudIA+7RB8fd4cNb/hQ5UYpjV1Xi6ZxGp06rCuS96HtbD2b69qF3G3w80wKUBgZCY/sMi8v5R5eSF2PrW71FpWdTNDHC3kqfOdUuKf5ril1YxfcQA63RuYzS4oJ7iJ7Kcxnpf1wAsUZqoTwLWB0AxEEpCuxqAkLWZpLD4xXf8WRNbH53OetlNpfvRjX9j+N3XZNCL9fgUF0seWmj7sAHW539bYIlwxSMt5KOYtvIuPKyuNCgw0QILA/i1cObvOgtNWnBJOMXoNE+u/mmKX6N/djM+EymRQgKzPuaKQDROl+76pwg9BFlp7qAXNMDv2qb4gzJjut/1iv3V34V4BlklWnlnzL9N/IyvHdE4WV9PgQVDJPfXPT4nFaMJhyXCIo8inW0AegBzyQLfAbCGcHHpQx0ElhT/9J2jqAPBbyyzZwiLnUgogX7Fr7FSOV3C7p/9QrPmAe+rJqw/AX3NAJsUfGyl0a/qO/4sPkJ6G8E25hOsa2rTSw1wYIn+tXW1wJcBvFMxwckO/e6Eqf0s8E2m6SjGa0MXIvpRuWeSMoiQBzqOKwG0aoMsKuchufozFT+DaRlUK6EU4S+RVl/bfsW/qMuNZoUzScEeDsX8w02c4vq6kodOdAsQuLcqUajeVpSeNixXf//DcchtRBVkul8mumDkg2Q6GNPxCLXbClLItsd3bqU7FwS3IoDHR7Ty2EC44ZAJxMJDCwgfIAMPeT34R2G/TjVPFn+m4id+CA+FUhyRWkG8OrXxshQ//z+XvzwTiqpd8O5Z4nLz4DCW5GqkE/deY83eZiIsTYVyqtTi7z3UELhIy3/tEg+a+eZbGZ93PlSy3oPBmvEayNsZg+CCLXBciUC7ocoFwAeNR+rLJOsRDYlsKKVbTXuyRaS8V9I+Wfy5e4qokLl7boDwNzTAA5U8nDEZZFLAlgtK0566KC7mAPNj/siYyG5imQ7GlEFcTHHSpr5FpUUqFH8lwX1Zz9J6rxBBN7Rr5rCM2N++Lpz92D3oYjI+BWD/2PZ97a4wwH6D+gUgIFr9tP5Hjf7GtEBXG5xejWlkfTGppwC8WbEwIkTu3Cavj2IN6i7J4s9V/PyucL9JD+H0HjLF7y71QxmzjtMitSsITIpCAeuCnN3J/U3uHvc2+PKoGrrGWb17xHRUKP5aLP5+Xp21fK5T4B+I4X9AmwOMT9lrnBRIdD0eechdJqZutvVBcLn35Y0vWjbhwOBdC+zqAqw+JxtyVmt6e95l/OFhrChZ/PmP2/q6Mawfo6GBXirNgF3tk6X4eZL/KTwEqJZoAbMWeWPVhrSMavoFa4fpenTlzqMZw12pEHmKUalR1yMKxV+bxT9F+bOs7yUl0/1YWpaFKl5WylLczXpoW7r4NRar6HDr5jqNrnMxk+3osL8BWEglk1yBpydcxscqSlYJerSL8YGVY0PJ4h+o+Ikgy+wabRwRse/3NX5fJsqRQGZutgU2ZqpeBVI73ujBRCqYvvohQm0DWroahdHP0GEGuCCWw7YqfvKvrPcwdel0/+7YVOBXCWV8jwE2jX1uvXbWf8yWkfZrQXu6UXlAfT6LF+uV/kPKNMjekERhm2mAR1uw3tpZSIp/sIitz4oqW4uD4GNnpSySbFnngrKUdLn0z8bo3ysB3DCqL7YL3OOd0w7uTpOuzcyyucKvxSVGVgqZylWazveUAwRivYBGyPrUNV57ELVQSwSRenesF0Q7ifVgMrx7lxJzhpmzn3nvPWgwC2wA4BvSCVvS/loD7JLHiwW2dsGezGgpS7T8rwZwd1HdgLITDbO/Iq7kIodvcegweW56bgvs6az+qyqYl3uKacS3VDBWZ4YYiMZmPYoZ0cyqIl4hEAjmVw7ZjvjrvR+reLWF6LpnpDd/TFfarCJl31sf0ehmSBerUPy13/FPXUNI92PEv6aqXW84ghhR+Zc98eeK2PoA1LWkzwDAsQY4Q9FvokuI8ud+GibxELucggEWR+KzzSQLHO6uvc5WjJvX5TEHncxgLX4rGAjaxm9F0XJ/bwCuYxIp7viJZMnrsC7T41NjZlza6JkACOdbBf3BFR6j8r9JgTxZxfxVjGGrCoYuUvy8b6HLX4NdXsVCuzYG7/PXiAkKy/hYSC3+Ru74M/ic3+VqU0GsW+Lh/R0A83OvKTFGnoIiBLEGVW9gbnvVfNY1XkhfpMdCCsTEeB1G+efm4FsfpPneungfwXEzY0EUrv4RXLqIZV6DrWoAZpLMooCNQi/iFqLRutv4QucJYxptaSrEX7fe6uUdXhkrrjSjHRiAFssGxgeUiWkULP4pL+114XpEvNa+Dh9zHwOWmq2EAo7+DxUgVZy/M3UpStQkKPzwKCt9VvJ8WzZIblVChcXfsqVVzs5GLm6GxbGmkQVeGzw/ZQyJyhkewoCFB28JT4WKn4NZgFbcDfBBf4nkEvgJT60G4L8qUij+oVj8vcVZX9SHrrqBuO8RwuCJfycD/Dmi7cAm1nuvNHu4UOGV5a3J/uHZ0AUtLZzDKzkeXh/O4zdgF1zKyOom19Syuf4SAiIzs5qSxT/paV1mgAMGPT8LzOlKXn9WWA66ZVuiNDvUH3eWHiUMEKX4g/Kn2594/pW4GqpawAiMQ+x+AtWUgqgdNcXfdwBguh9RDV9R4lkx6I8b/5faMSywVwgylQ7BaPalm8o2kDKnbW898qKmsibdsqzg91LBx5r52ET2Y3rwuNFRZsB1UlL8s7YD363lDMBCXYVkgWNZortk6nDhPC1scJ0BdqqSr2jF3/ch50meJ/o5qmSko2PxLvmYKvLTR1Xxh0Mj7+gYoCStA9G/LVgKdktNZkiAGaa3RYoDzvm3NcDNXdyfJRTQiQY4qUgmIZOBsiuT6VE0Tdv+zjzydQaVky4h97attSw/TN8VVf0MGSREDZ2r7OQj0p+HIh6OMtNptWsQK/7wIWdq0ri90BIZMzhtLwNcK+lUYEGNRHBf3hossCaAOwAsVEImTKejXPniR5P1QYK7RXeY3fBGA2yv6DcSXax/Fsy0mVvIMK19Wv20/gdSBeiWRVO06e8sWLaas84YCJpLLm6KnpBx95ze7A7x22oeXojVIZbKdpr+I9anFmRTleIPyp+neEZIH+aAEhiAkchLgCh2p1UNHKGw+BtP5yvaAOGFJVCPJp2sf3iCvUSV8HTlcbcK+AJF7E39O1HlCFyjvl6QTjiM9hY4BMBFirkfNAJMC+uhnY9XVPRTsDa0LmcY744uOgwxRZqp0uNKlbxbFtg8yHHpjgryfgNsVMfa1Iq/x0xID6LyZxCXFr62jrU1PSY/noxCrwWmuAuKPxwYmUbGfNqyKaKEhd7bAPQCZFIooEQseNZUkNKhRqcQpfMMvb31iHmrKxg5xAhw1a33LPA7cXQHXbVM1SW4EwP7ihQ/jSYCm42Lu3qqPA42Pu6nEgr1ZT7aQXkuX1cti9KKv+8AwJea0ZlEuCPk4jgQXXpUYuc5JL7n6lywQvE3itwnXbv1xV2IhFiGvh0KveTByTIYlTUVpPSwGZ89zKyd9ULKrlROzOnn/aPIK2KBhUOdi306ZCxsZoC7YwVYIqUydoq2tvuGq6JX9tA/bW0BXZVlfXl9oMX5b5PMPmKAmXUxVJni72cw5P6zZCt/DOzqkieArmrCk95SN7TsFJlK7/hb5+qfuolL4OX3D0Wl886pCGnWAwjlpp0VvFBRpZLreimHMW6JgLNbTYnyzKFC4jYA+BvFWgZ8XFe6bwEPMSJyADUnI/LKSjRwuxvTK6LCMoldlvXVUgkjTf2zYWy/FrV70sUxrVQnP7Uo/owPPE94vIdZHMCSAJYIv6XqXFyJsZ9xechPhx+Dn/i/GRVOS7B0PrmGL4XF33rFTzlYgOl+zBIpQ7wz3N14OM4JcvJiCqDm5akUNKjMoprs6+C5Fwl7XBOvI47OzlqbC8Kk4ufHmgWw6BUgT/yXP2mN9qbE91sAdMmyVLOYQpEjwh2PA+5BVDaIWIgDOlifyUMPNL0AvPLjv9Q/1EOLVjlXhWPVDhb2/9usP6rqcSjoAAAAAElFTkSuQmCC',
          width: 60,
          header: 60
        },
        {
          id: 4,
          type: 1,
          name: 'SqlServer',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 5,
          type: 1,
          name: 'DM8',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 6,
          type: 1,
          name: 'StarRocks',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAAB6CAYAAAD3RGynAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQyRTM5MUQwMzRCQzExRjBCRTYxOTAxMTRDQkRERkM2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQyRTM5MUQxMzRCQzExRjBCRTYxOTAxMTRDQkRERkM2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDJFMzkxQ0UzNEJDMTFGMEJFNjE5MDExNENCRERGQzYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDJFMzkxQ0YzNEJDMTFGMEJFNjE5MDExNENCRERGQzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EHq6lAAAgC0lEQVR42uyd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',
          width: 60,
          header: 60
        },
        {
          id: 7,
          type: 1,
          name: 'Doris',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 8,
          type: 2,
          name: 'Redis',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPgAAABACAYAAAA3SLoTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNDc4NkE4MzRCRjExRjBBMEM2RUM3RDcwQUI2RTcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGNDc4NkE5MzRCRjExRjBBMEM2RUM3RDcwQUI2RTcyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUY0Nzg2QTYzNEJGMTFGMEEwQzZFQzdENzBBQjZFNzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUY0Nzg2QTczNEJGMTFGMEEwQzZFQzdENzBBQjZFNzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6H65EgAAAhiklEQVR42uxd2ZIbR3a9mVVAo/eNS3OnSEljjx22YzgOP3iJsIPyH3CeJvxIfgL5CexPEN/9ov4Chxh+8MvE2KLtGWsU0lBssklxX5q9A6iqTJ+bebOqBAJgdxMkm63KmVQBBdSCZp48525ZylpLVata1fZniwd5st/+/FO3rWuiIa0o0vxOEU8hSlm8QrPKd429/Dn28xxjjf8Mb/Fdv9993frO5/H75YxWafRIaRuTNnX0cZPRrM3UHGV0HF8+6E5o6Sk2t5VW93DEM9Kqhf0ZzpRapTJ3CUvhIrgsDuFu+FDl7ltr466t/C/Afut+kw3vVbGHT5Pi2FamqJ35v8vfffttNdKq9uED/B02RtYQ+jAwNWyNHVPWTAGyBwHuOQD0GCl9wKHV4HuWUj9BqDpZvYGXWzg29HY1DKpWAXxvNbAzHQZQj4Axj4D9j7ltZg8C7FMA9xT4d9QRsjXrAPgL0Oxja/UjzAyPsf8h+iP0B+hP0FeqoVC1CuDv7x5rsq0LuD+CFj4FSXwaGD5FUf0jVYuO6Cia5u/YLNM2TZ2BgH2GojjD99eVSZ/hswfQ33fw0RL6bfQf0O+jP0NvsXRHT9BNNTyqVgH87bYJAfQB2c6iH2dQW5PNAbSHVFw/FI2PH4pmZkajyUlScUxmfZ2yl8vAsSE9MRHpsbGabbUaZvnFbLaycsi2W0fJmI9x/GPo9qeYKO7hvHfRn5Z6AHzVqlYBfIC2NfcRAfQR9FPSwdZ0DHL7mCU6ZK0dATjrerhRjw4crNVPn6b68ROkR0cB7peUPnpINk1IT89SNDFO2Ytlat+5pUyzOWPb7VEcf4yMbZPWW7giy/U7AvI70pdExq+InV6FG6pWAXyXbRh9En1KWPsw+gn0o9KPyfYwaHkWNrZWUURqeJjA3FQ7Mkf1U6ep8enPCGAn22xS+vQJtltEjWHnIU/iu9gH8xsMD2Yfsmk2BBYnwnkA8jmAfE4pdUorOgMk37ea7lmysNEt2+vPBeihp9XQqVoF8Nc3LaBmAJ+Uzg6zj4S12aYeBaWzw2wUQGWPOfANCNZqFI2OUTQ1RSzNIdNJj41TfOAAWHyc6mehwFstMhsblD58QGmtTop7ve5kPGWZD99pzXG5GADHBKImLU8sym4wkJV3wP2AzwK735PONnuzGj5VqwD+41YX+T0CdI1CIs9YModtZk5xx/uTAPAJAJn7HNgzypW7UnIK61hXaeUC2GxnM5CzFcjyx1DUQ0M0BODXjhx1xzhwP3rojtNg/HgKc0YKcLeaZNuJj6kzkxujsywbT4wdd99Fj5VaB6s/UqTuCsDv4pJL1jvnWL5zmI0ng015XTnmqvaTBTiz8JzY1UfFlgaQ8d7Ywwx24hCXRTdmMiSNOFi7pJdgnlv//8yQgQRnYCcAvGm3KXv+gmKW4QmAOwL5PjZBNsH+jXVsEy/pZw/gV9fIbm2ig4TxObXB9Ohpy1IzSykzDG5LDa3HYkWnMZ1M4concNk/s975Flj8kWwfyGv+LKmGVdV+CgAfks6sPSY29enCYaZOg2FPkY5mdb0xBps6ogicGXEKHDO0s42FtJmpMy+r09QxrpUUN7O2Boy2KX3+nNr4frQ0C8ACzI0himcPUnvpNrXv3HbsbgFipTRpsLyRCYS3BudMwdlNvN8EuNuYPDi1rq6567ih1QFo+FkIAgNGb+GuXnA8Hf2e8Wy+VHLKcV9lRleFF75i9qrtK4CPCJgZ1IfIecTVSWLPtbUH3XulDqm4NqtHRlQ0ARt6apL0+AThPanRUYqGsa0POZnNLGy2tmBPr5NZ3yCzie0m3m9uOBZnuZ2tAFPYpi9fkjvf7Cyl0zMA9yK1vvnaTQCKZT7mD5OApdMEjN3G5NCiBBI/waTQSg0Y3NImthuYTIwDuaaxWNOIVgqMHqGPNCI1gqloVjlvvlMhT3GjTyEwnpOPqy/hs1t4f1dyWF9UQ61qHzzAxRnGMPoU/RfKS1oG+mGW4gDDJABewxfrYOyaHhtTtcNzVDt5iuonTgCUBwFOgBx2cjw5ARYedizOXvFsfY2y5RcuBGZeLgPQK5Q+e+aYOXl43wMfslvhImx3N7/5A2zuEUruLVHrj99RurriPeZxTEzQqfVM3QKQW9gmrAqwnz/bAos/TzJaxSQALUETNU2TOHayFtEEn0NFNKzVcKToKKYfjtEn+K1taxVEgPO6f4Ptb6x3HFQAr9r+ADjI8R8Z4CC7v0T/Cxdygq1tvDd8iMQp5kJcQyyhZ2no7MfU+Ktf0BCHuCanSI+OOC84M3m5sY1sIcczx+LoAGzy4D41v/vWfZa9eAG7PHM2dfocpjBADbnvJoHk6RNKNzcphTzPAPAE2wQgbQN6LQY6S3Vgsaa8SZA6qW5oGSDP8Pl6pmmzZtx309g7Btj9NwxGB8gBdDVMQtX4zxw+Hue5ApPIpsjz/3lb/4Aqdz5WbZftDPqF0vtl9Gvv6uJvu5pzoAAH8f0z+TqxX2BUn8KLCSusHmxpXzYGgHOYC5I8Puxj2ENnzgL0DR/CCrZ3efJguT5TdzKeHWYGgFWNBmWrq9RevOXZmS8DYGZrq86z7oCIrfO21+uwsxW1YWszoNsCbA5oZyQ86z16mKgURX7CckyfoLfw47Zw7i2jaBM0zzIEwKZGCWD883CuGBPEMZz/k5Z1Oe/ZOxysF2TA7qTdQL/+EwHz5Y7X012+c32bAJ+Wc5wr7Vt4l5PDOwc4pC3HsTUw8BFgPFdnf5nyuPGVo7501DvDAbos9fazk9/LjtUZ+ByvZimtBOjMzAxqdpLZdtt1jm8njx9T+uK5c7TZJgANSc3OOGZ3Zl4GqjsPJo5oYopqOLeBfZ1tNSkC8OPMOAbUAk7+uhHPPWxtmowjvNfu9Shej+PHjEAV1PgYlfv03TEpl6zhR7fxBjq9tpXZiS2OCgwQ4LjXz7G5+JbGAjPXvAzwG/sU4FcHeK4v0M937DsvwJ/flwB/mdqXjOUhS5sNoGY48nXhdQljM5jYO8511LbtpXTr1k0HkuzJY8fO0Rjk+fgY7GcQf73uIGRbbedQywBcA3Y2q2veBn/ykNr37mL72E0WKoo97RrvYbcxe8wbzqavzcxSHRNIfXOL6uxxT3F9qIkUUj3leLnxSGSvOk9KYwD0kKtrhwTBPY/iXJDkVHe/B3JeK2F4HIfzMMM7cBtme1JNw3OJZdEwSAZndljsYJB+7XoHO1/oYJxORrpaus6lfQhwVZLkF3ehdjrB3Gv//gT4euaKNjSk76MkokOJpbHhyNKQIgeM2DmxtY9os4QG+7IHO8O2/f1NiqZnnB3uPOpjwcnG7qsSwCHJM+lm9aWzyfk78cFDbjLw4TUcA7BHsOM1e9RxThXXnBMuTp9QzMCNGJjKgZvTXdrKS/bIrUPBrM1/HDA3GHs89izOktxZGRxawzHOUQfZ3sbk4IHtO353mrLJzskvdnAhMpgaNzrY9Qomzct9mOl6x2CbL8nTXhKVZPDzRPDLfQjyRfk7cL/1BiBf7vH3W963Ej2zLu6rMch5zGfedlV+hRcAiEHO8raGUc9dQSpzgoqF3M6ePnXhMWZuxcAcBrjrLNlj70gSBx0ZjoUb50DjFFVmZ04/5di2s+GDzMfrmCeMqSln17fvLlHr978j+xKmAAOdb5RBy5MDwFozPmCfscMt8qvOsPJoRAxub29nYrc755ywNYfV2J5nJmfAixJQxpaS795um38NWHsdwyz9eYeDqdzOyXnnaf+2hW2ooF7tikys0x0T6qV9C3DGiTjZYgz2KMVIbwLYcVYs4+Q6wMOszlkwMQCr001w3RYpsLKzu9HdNmL7ue7i4dqBfsRlo3HFmOb8cw6pOcafBtjxenQMrD/iwT7ccGmpDHYn56ESUs56e/LEJ7zwdyLmam+DxwD1kKNJlZeNKXG0MeiZqVvM1OJwa2YFa2eUr/jkkux4HlDFijHvIslleYcAD8f8SmzJC32cUvsZ4G/Cttf2mkPtrQMcA7shAB/mchAJGzkAMEg8o3u7ltnRbzEBYD9b5jH7uNk5BpuW49mWnVkAqA0AHxn16aatSSe59fg41U99RLVTp6l26JB7r+K6C8OJ395Le7bTOVTGcfTmprPR3SSgijXgdO5E9wDPhJWZoRMXTjMO1MEDn4hDLbUFgiWZlktLOe79gIy6T3s/i+1SyTnUzS4/U7L7q/aBtUHHwZviMN8CThgHQ4ENHctxgonyzqjIxZ2tAzqD3OW1ai8BYqWdo8sBlGU52+DYcjYbA5CTXdirzra1Pd72Mh7srtlmL084SZta331LG7/9DTW/+drZ795G90AOVG0DSJWnXz8ZUS7BHVNbf9+ZTFjhmBAhkAgbz27M2o/x5jaMkMUPAODLIi17sXgF8Argvo1o9bVncHsA438iU3QCmBjFCGeS1qkAwzOdq9ailrPPecsSWTlWr+ELNWcb+xt0HnhOkElTt4iDKwyBhE/GxlzOOYM9ffw4T5Th+Drb8Omzp9T8+ve0+V+/pfbNm67ARNdrDtghx8wIApmxfYYbOXZuCahbmc1Zm+1rv3ZqUfqilfj0XFzc5b80HYNb9chY9Zg+jDz0G30AXrUK4L5Nxep/ecyD4SZgg88mkOpJBnsc+1LrpHvBruSdUszqhqsyrE8RrTlGV3mIyjO8X5RNB2Rynvjaqi8igV3d+u47Z5PHM7MUHz7kEmfiA4ec3d2+vUjJ3SW8fuYByZVkqgBqmpsO1nnDnRfc0I8cZ5lMBOGYsn0eS4SA77kOO6PmCR6HKcvLJ+8Tr3PVKoATJ4I4tYpxnWVWtRJOHFUgXOCYw1AuZixVXCFBJJMe1kHnEwT7vOjKsXwMeR3HkWd09r7DriauAccJ2ZPOzrbasWOUnv2EakeOuJTWFOC2nIfO7M+hMucN9znnqbG5X4DZmm3sljC1m3yoSHzh/wSzwTO2Vxm541C50JsF4Gs4dCoxaq6l1DGxTvb6wujn+4C7AvjrG3vTQ37BFdpDiUIDBTgG9z8wFCKt/xo4+tiQnUo11cHOus0PA3CAUmBID6y2ACg440j0LNvBvPV2MAOpCLPVg52Ob9TYA8/13Czb+TkIXFmGbtbXKLkz5erC2blGHHOHpM8Y3MaH7trWe8Xbci+Je2DBq4xNJTubTQpmbA71cVSg4eLpkvjiJiBnxY9gIjsCNfApJrMn8pP+fY+D+3wfT3HV+rfO7MLpvXRzAwU4mJoBruuYzeqkjgKMDSAjGgbBtkX2hhATg0sLW5qSbA/hpgA6BlcUpHvOlqHHVAPSNC/FxEhikDNrA9Aquu9j52nmQJ3GdW9LZ+I4y2X5K2Euz9ZdwN3QqlAUEbn3dUlblXUo2BQZwW+bg7lxeiuz9+nd5qLvtDHrfNEH3IMKkYXssX6ZdERFquyb5MZfluv1S+ldEJY9/wbXuUCv5qLveHJVSp17zd9lUf4tlkF8194rwFdTyyVgumFpfDii8YYwXU15gLBLvaE9MEKiSFtYM08UEVbPmZ28hE9D4QfL6WCbO8BFXro7UHpHHDVbLimGs82yKKI04gCccmBuyzXdBNI9zOUluNxzfu+6BHDepz2TK6FoV7zibHijoToaGykNY9/QHgV4AECvJI8rAwJ3SH+92OMa1DG4Q4YdA5xj9Ms7BPbVPmAmKtJTL+zSqRj+brsp6uk8z+ddJpgFAfTlju+634XJYBogn39vAF/xjKWblp5Blh8YgarmfPS6OKMi8TbXIg/0EZdA4tm87WLOfuvzu63I9aKow4HR+syxJikBWciQsy7cFvHzzYifWKT54WPu+WAunZS8dzycN0wgTiEEgKsC3EM5qEM+vSrSbWU2yGRSatsi6YXVAX57CqXQynyiy/sE+PkeQJjuw2zzA7IhGbRfdlxrUYC90MHa50VJTJfu+yv0z7bhAzgjx57rogaudNkXALNbgF8ewKT3ZccEwX/vzwDeMKFxCvLVLtfa8aQyUIBjkPMDA1imLmPgb7WtqjeNOKC0t6XZfo6CzGaG1d4OZudWQ7zpbdMB9FKyTCr+OA6zuZQ55T3fNWF1jq/zIqlGFx5yx9imsK072ZoBy8dFSu5ReVAPi0kQgB0mmkxMi5Z43dt5nDxPfrGZ3RNPSDm/TRm6KIw5KOdQN3DfEMB2Y+XA2F92Ae4vXwO4L7sM/M/6yPzwW/vl8Pdq1+Xc54XJd2NvX+5yv1dK4PamorUM8utd/iY7anqQo4lNXmf24r884Ncx0l8CCS8S7hm9xHYNI38r89KYAVNz+d6KxtAnga4Z9GkgdQqIGverKVC57DS31cmzeV6rjXPyuWEm0Ar6Kl5v8LVMkaBiu4A72Nbu+rjmNGTBLN8Dui8PlWo48mzN11lHf5lY+V2Gq+jcvqYvNGFE2+CEp/f7wIQr8lNn5PVyH6AMyjk03cHGJNf97DWS+3oHs4eJ4uIOmDD85u3Y8LtVKtflGp8NUFUtd8eT7cxt3/G/0aBz0Z0NzqmqwHWdH6vLEplnEWY7tsebzga3eXipJqzLDuiGTDec79ri5Jc8fOVkr1sXKYSvbMnTXYTawsOKSw6zErxCmCsqhbmC9G7kctyrAiWZblZWfQkTib8n9MznpbMyCPeh/CTCzL2G/hwfP6e9kegSar0XRPpO9/AG/5LevBqqWxnm/Buc93wPb/7VLte5vkPfwcIbOMluvMEE2I3Vf9UD5NfY9t4TXnQupRaAxzB/I1sOfTEQjZVKrCCDPejreW662NUMwkhCUTxbsIy3ymWVtTjM5iSyOOjKGLadt1PIlJCUEqtQ3VZ4xGtS310rxbozW3acFVltiaSxhtz6TmVAfiXVpwD7Hdp7qaqhVPJqDxa/Sm9WDdWrRv0q7X6xhXN9nF3dPP97vd3oMjFdAIi/Eql+vQvI5/cEwAHOx4InfkzvUQz82bzEGqM9eMrb5LPSarIYRGDzBjvkBPzOi03iwY59ckpbiyNLPOmxpJFmwrS2q6jw4A52dV2YuhEUhPbVZBLmco44njTapXLQAPDEFKmtYQIJE0Kek66cw38dr5atVcu091JV56l3WOZiD6m8E7ad7jKpDBp4F3uolIUPAODXejj4nN8CQL8hv+Nap13+3gE+rN0sxIWeHCHjarJPAepZ9GEAO+50cqXMiLpIaGF7ObBrXcJRDEAnp5X3vjPrNjhphhlVeememhBm897xHHDaA9DJ8BLAh0qhOyXe8IQKJ1lgbRc3l0SYVCaS8v3rkh0fwmY4r/MhGqMmcegs7c1c9Esi1akH217fpaQ+04OxBl1yen6Akvldt2BXf95HsXC/GsC+Zxh8JFK8QobGQD8IYB0HLmYgc0chyTmbLS5niQW6zcLKpooZUwkgrVtoYdiBEqAXR1cAU6TlGUiaJKatBJyFja69ovCAlpg5e8gjksQUKrz0bVEFTVmZJQled/L3G263xNLieS/y0POQmlL8dhaTw0mc56M9CvAAuss9QPp5L5twF/bl22jnepgfH0q7Jv8GV6l/lMOBXVbtuQSgL7xXgIN1+dFEGgP9EAb+OPvSwM4a4FYtE8AYbFibO8cSCplk1gEn4WWUOJWUAcphNiNA10XiibOlxY5O8/psym1iJbI8rCLDtKokBp5KoktYmaUtIA+pq1mJrcvAjvI4uZJzF1J/SJx1EBk1SPxxqIoDmV8zfa9WkwWp3o11QyLIwgAAfmbA932G9kcLYcOQyXb5NX/XLwB0lu2X3hvA0f5eCPJvAICfx1rNgWlHhyxFqVG508qliUpSS1Ji3SJzzYPNLbjAQJVU1RxMWmS3SPCasDoztC0nsDhAFqum+uvZnKmbEkILRTCh+MV0CalFcr0ig458nDzyYNfks9oyTsvNbG0zM9EaL/pWRPf2WlsWqfhlj88/l0G4uMNzdgPkNL39tco+SOCX1tnjuPcFKmLsXX0P+M7iTiT7QOPgAOXPuQM4f47txwDOAcUV21pFowDCBDTzZI1j3LwksaYJiX9zrLkhAC17sRnkIe7MMe4ViXFzbH0l9TH1zcxPGn61dQl9ac/w/L9MylDXM0OrqcmP5Xj5msSvNwX0wYmmVJDfknGHN+7+I3/f4f75yYQNURNGwmjuOug4d7aR2YT7HrcHr/Vhjau7mDS6nWeQteaLO5DtHxrYF4ShZ/r8u+wok26gAAfYzGZqDUCjAKLaGgY6AzARzxeHqYbLSSWS2DIF0Mvzv3JbO2SJGAF7WISBk1fWHNA5ycTSC36N6zCwmtYU+eaSlLKW+kSUkJTCE8RaSIAR55mssvwjB1pNGJpXVOX7m6lz8osk4MQ+bs6szVJ/Uyagly6Fz4FbbZWk/h5v/RJgLuxwQF0fxKDcprztNpFc/ABw/CUVj7Oa7gH0ZQF6t2SaabD4mfcCcADqBff11K6uJLbF2V6OLbOQ6UV5BpvLHotVzugMnInYM+VwKMXURciMWdWFr6wVRvbn5uw4f50igy1ktL0MPfHfC4zdcrLc5mGuKLfX/TVHIAXGIn8/U3FQHP7eWB0ocdBtynWWE5N3fg9FwOm6cQi97/EBt0yv5mx3etXP7wB4N/o47nbaei3vvNDn+9MfwN97WxOSxMTfKMQ46GWTWY5qt5YCP2NE7Oym8THvEP4q13U7p1kkXmhm1VKsOyyVlJnuSSVcbpop77Tj78bGx9eLnPHg1PPnyOjVGm9dqhqr5fdWlIKGOLmvGhMPu5VYfFgHXfalNn8MEocI6+Lsf59Otu0O9msC4l5S+gthk+2EouapewlqyN3ejnf+nEwI50oTx/WO++0G5jOle93rAHcTEtiYZfniDtXKtv0ZA2Vw//xsr6z9gg0+UcSxLUtkwH459a/ZHg5saqRohG3dcWen+1zwKWena7d/KPegF95s9ygy8k66puSeB3t9PbfPi4mhnNFW9oK765bsa+5jsh66XzbZP5dsTWx4Ng2WRTGEHPS0tAgjZ9liu0Eu4cX19wXkCzsAeT+pzuf4apu29EIfhuXjb/WR7AHYX3WAe7HLAO/laDrfcfxO/27Tb3lSXez47pevkdydv2NHCTDxgAG+JRhKKLCoyFlyKW3eHm8zO9oiXZVz0z1beq93QxJTGpKq6uoupXorKa2TFno5VbXssn7VE15kteUpq1pLjbe/Pj8EISy46kJpWcHU7VLFmCsTezVNNcw5nNH3Pfof6S0Wm2BgXKTeSx4HRrtVAsP8awbe/Gsca190gKvX+UJl2Pke91ROXb1CvVNP+9WFz1Pv1NhzAvIQb77WRUn0kvPntuH171c2elH+lje26Yjkc32Ff8tX4twS/77Y8W90ZUdjZJCPL/3Xs2f/xTmzrfonbP8W/TSvbm5L2WUqt6l9hlrs0t5Iij1ULt9DeaZTAiGHPZOc8NL7pJS9ZvvIlKiU7BJqvDtlOJGvUEutFJRIlZo8jigPpRn7aplYWOUZW35801c4zb9h+x+879e3b90cEKDf5FE75UFyts/n22W/MvPP97Hfd+NgC36B7difuyn73K7DMGT0hafAnKGdrQITbOiFDhXzRZ/fPV+aKM50KKNLO01fHbQD6Db5kPH/YfRzZRk/H/sA3vMjhMfCl1JbPBeZDXauEuOkFn4KSj1SOdjj3D72r4eUz1oLueFNRXm8vEhMsT9iVFYE/CPLT1ZpaMqTZrQ8XygVEIfVVZt5gYn3A5hXmTq8DjJ8QzyjzNr/if7fAqZBMvi7KKa4tMNBfOM14F+QwXpxm7/vxg5/Z1jmaSfOwPJDHK/2kfrnS4x5sQTC7fgiwvHXu5gwZ6moB7jQIdmvdvkb3uhWhPI+GPyoSPRTOOufAq9/ApzwjzmJfSeAzQMk66fmrF5K+wwZYj6pRfvFFnWRjZazLHkwtqWMtC3gdCu2lAAekmDy5BgJw3l1oPKlm3OnmSsBNeI0K1ZsKYe61I9LUp+hL+HUd7H9wXd1E59+j8OYyflpqwQGf2toVOqDW5r5cheWu/EWz985GXSC8FwPP8I7SX0dJP7eBcADsTFbHwYOTuH0P8PrT7DzE3xyHK8Poo9a72Guy4SQS2xNxSKHtZKUHtJhfbdi8Qcra7iluW3841z03CvuikG8SRAeeJCUHiCY15yLN9yUHGYdJn1behNvn2HHEl5/i8vcVN7WvWdJPcD+1RLpv1WAV61q71Kih4zTVfQtvFjB9imgckvxU088wE8AmMcxs8y5SYBoxvoS8HytNJfySVZyxr1ErhkBvDByXf1YwrucdOMf61tOVQ3rwOUOv0wWbswXkrB5Cmv5sUQkM4/MWJKYoB7hxUO8e4B99x3Alb1DvM871niBh7QaVlXbrwAvt0Qk7CrwdxtoGYOcPABwnwJAPgFmzvpOx33tuJrQXjmH8mzJC/fym+PbvtJMO697Q6t8sYhQUsrALz9aqJDzNn/WWEuYui1PDM1K3nBbcgSWbmHDT1J0TzFTW/U9PrlJVv2glH1slV0pMbuphlTVfioAD6TclL5aYrqH4pDjJ34wq38E8BwTJ8MMADQLez0OoLOmqBBLlBFHW5DgUmkmjB70fp7oUqrrdss+hUUiyCe/hHXQS04z9oQzaF/g42eZovtQBXdxmXuRJd7exSwEKW6fySRWtar9ZAHeTcLz0z42xCk16gCt6DS2H7PNjs411GedU87b6B6AHfXj7HlnD3yswoqq+dNF5EJil0spaZqv/GLzjLYu3gdeQ+Kh4ntTdAfzyPeJUn/MSN2BQngGfbAOkK9ju2Ertq5aBfCeIC9neN0WsLPX+SSzubxnkDuHHLbjANyYOOXyp4FyYzaOTFhvzbqy0ZCqWk4h7ZKQEqQ4L5C4bv39PCLvPWXn2R3su4VTLKYK+/1pqla1CuC7kPEPhdUfoH8HW/13QOBJke+8Mgxew3YnOmwZ7GGmKNnORhBYfoRpiI2bjowUldvbitXEkiWzhB0/WHnYHvazGcEhrhfWxz1tBe6qVQB/s7Yq/R6Qd5Mdcnh9BMg645xx1n7MIGeHHKh3GiAcJv80pFp5pjBdkCh2Oa++wCuehs7A5XTS79BvQtLfxud3AHt+OsumnC63zVU1VqpWAXxgEp4BdhdAXuZ4M1C7ZI35A5nsGPadUFF0GhMAgE5H8G2W8RO2dHCnFCfvU+Mss0c47gF2PnTdqluwye/is0fiG6jCXFWrAP4OG9vHW2DvB2RMzWbZpNL6KCj5U1L6Y/Ipf6fRTwDIzPhuXfaSGk/F1mfJfV/s65sup1s5Sc62NXvME+mVEq9aBfB33FyyGkC+BZCvgsE5PMVs/INI7KPkbHR1BPicVP7pKhH5lZDxfcfOP5RALimlVIW5qlYBfE817/bmktQlAPept5/VmJfp6ohymXF2Br1mSYH5nbMMNr1l592GSP/Nso1dtapVAN97LRHANmXb4oQ1XiJNwFuX7WNha2bxdq4GKnBX7SfSlK0CQFWr2r5tuvoTVK1qFcCrVrWqfYDt/wUYAKMHDsTOXqQpAAAAAElFTkSuQmCC',
          width: 60,
          header: 60
        },
        {
          id: 9,
          type: 2,
          name: 'MongoDB',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 10,
          type: 3,
          name: 'Kafka',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 11,
          type: 3,
          name: 'MQTT',
          icon: 'data:image/png;base64,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',
          width: 60,
          header: 60
        },
        {
          id: 12,
          type: 4,
          name: 'FTP',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA0NJREFUeF7tWj9oE1Ec/n7nJakWHcQi1CatUNo7KkhxcmsHB0EXJymdHMXBoriIWBc3Udo6VwfJposguLSTIIhUsCY3lCa5qiAiilLaF5OfxPbCNb2/aSLm7t2Wu/f7vff73vd97727EGJ+UczrhwRAMiDmCEgJxJwA0gSlBKQEYo6AlEDMCSBXASmBTpJA/ggOcpd6ymvM+trvxTA11RlgZJLzzDwQJrjelrCklcpT1u98OrEAorGmcjUEMXBHL4np2u2AefNEyFWq+KAqeDtUFE+9xlEHIGBy11wKY2LIFNlcJjlNwO1WFG/l0Eri7zjzmSQ3kfcVM+Z0U2SdYlsGgDVT/yEAW3UzXlRYTI6s4ZsdiPgAUKuaMK8VxaW2AmCkE5eZ6GETVHULKWglcXwPEtiZlzCpFcUT62ZLGEDA8nBJnLCS5tKpa4TqOceKnMyR2dW5K/swNVIoL3kCYIsnoh4GRjwmYBXr4qT2FT+3SLF9uZkgV6vjYZcWt85zfeoYKcrCrufMi5pZHvdjjZsJWiZpxRv9qbNV5hkCBp1y2muKJAC1ot8dRXcqlfwE4FAjCMx0XTc370WWAXUp9iezxLi4GwBkdVNMRB6AfCZxH6CrsQXAyCReMujMniXgZCTNGOO/MsE3vTjQrSZvuO1IQ5mglzM3uq+fi7cLgNoutL6uM/cw0WkCRp3GQ8AKr4vRwMugV1Fhl8h2AeAHvP05ES4MF8WzlmyEOg0AJtzVi+LmDkD8NkIRYcAPMGY1U9xqrMd3I9QJHuA5ScxzpCpz2uqm4eIJW7ddt8I2g7En2FDEg9ECvofRX9s8wH6WIPqogF5XiZZVVX0/uPLri9cYfRkQVudenbULgLCrUSgPkAB04GkwjCylBPyWQSkBKYHOeyMkPSAEAtIEpQluIxClt8IhFBDN1+JNAWCkE7NMdKUxuIvU3oHi+ucwSb3aOr3bV0Dnh0qbz/36cPruaP967BfveRo0+vYfA1VmGHzYasjAY90sP2omsd+hqP5cVQt6YaPQ6j6C5pP/EAmKVFTbSQZEdWaD1iUZEBSpqLaTDIjqzAatSzIgKFJRbScZENWZDVqXZEBQpKLaTjIgqjMbtK4/QXyoX0tjiuIAAAAASUVORK5CYII=',
          width: 60,
          header: 60
        },
        {
          id: 13,
          type: 5,
          name: '阿里云OSS',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAABACAYAAAAJZEAxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU3NDA2M0I0MzRCRTExRjBCNDA2RTBFMkQyQkY4N0VEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU3NDA2M0I1MzRCRTExRjBCNDA2RTBFMkQyQkY4N0VEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTc0MDYzQjIzNEJFMTFGMEI0MDZFMEUyRDJCRjg3RUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTc0MDYzQjMzNEJFMTFGMEI0MDZFMEUyRDJCRjg3RUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6DKRrZAAAb/0lEQVR42uxd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',
          width: 60,
          header: 60
        }
      ]
    }
  },

  created() {
    this.databaseList = this.simpData.filter(item => item.type === 1)
  },

  mounted() {},

  methods: {

    handleChange(val) {
      console.log(`分组 ${val}`)
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },

    /**
     * 查询全部数据
     */
    queryAll() {
      console.log('查询全部数据')
    },

    /**
     * 新增分组
     * @param group
     */
    addGroup(group) {
      console.log('新增分组')
      console.log(group)
    },

    /**
     * 编辑分组
     * @param group
     */
    editGroup(group) {
      console.log('编辑分组')
      console.log(group)
    },

    /**
     * 删除分组
     * @param group
     */
    deleteGroup(group) {
      console.log('删除分组')
      console.log(group)
    },

    /**
     * 打开新增流程弹窗
     */
    openFlowDialog() {
      this.databaseDialog.visible = true
      this.databaseList = this.simpData.filter(item => item.type === 1)
    },

    /**
     * 配置弹窗确认
     */
    onConfirm() {
      this.databaseDialog.visible = false
    },

    /**
     * 配置弹窗取消
     */
    onClose() {
      this.databaseDialog.visible = false
    },

    /**
     * 选择数据源类型
     * @param item
     */
    selectDbType(item) {
      this.databaseList = this.simpData.filter(data => data.type === item.id)
    },

    /**
     * 选择数据源
     * @param item
     */
    selectDatabase(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
// .el-button {
//   border-radius: $button-radius;
//   padding: $button-padding;
//   background-color: $btn-bg-color;
//   border: 0px;
//   box-shadow: 0 3px 1px -2px #0003, 0 2px 2px 0 #00000024, 0 1px 5px 0 #0000001f;
// }

// .el-button:hover {
//     background-color: $btn-bg-color-hover;
// }

</style>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  background-color: rgb(247, 247, 247);
}

.header {
  background: #fff;
  padding: 10px;
  margin: 10px;
  position: relative;
  user-select: none;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header .icon {
  margin-right: 10px;
}

.header .font {
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  color: #606266;
}

::v-deep .el-aside {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  color: #696969;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  min-width: 200px;
}

/* 页面主区域的 el-aside */
::v-deep .page-aside {
  min-height: 800px;
  max-height: 800px;
  background-color: rgb(255, 255, 255);
}

/* 弹窗内的 el-aside */
::v-deep .dialog-aside {
  height: auto;
  min-height: 390px;
  overflow-y: auto;
}

/* 删除原有全局el-main样式 */
::v-deep .el-main {
  padding: 0;
  margin-left: 10px;
  overflow: hidden !important;
}

/* 页面主区域 */
::v-deep .page-aside + .el-container > .el-main {
  margin-left: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 弹窗区域 */
::v-deep .dialog-aside + .el-main {
  margin-left: 0;
  box-shadow: none;
}

::v-deep .el-table {
  border: 1px solid #ebeef5;
  border-bottom: 0;
  min-height: 630px;
}

::v-deep .el-input--mini .el-input__inner {
  height: 36px;
  line-height: 28px;
  font-size: 14px;
}

::v-deep .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
  color: #606266;
  background-color: #ffffff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

::v-deep .el-pagination__sizes {
  margin-top: -5px;
}

.body {
  margin: 0 10px;
  padding: 0;
  position: relative;
}

.body .group {
  padding: 10px;
  background: #fff fixed;
  box-shadow: 0 2px px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 220px; /* 设置最小输入宽度 */
}

.body .group .search {
  margin-bottom: 10px;
}

.body .group .search .add {
  margin-left: 10px;
}

.body .group .queryAll {
  width: 100%;
  margin-bottom: 10px;
}

.body .group .group_icon {
  width: 18px;
  height: 18px;
  margin-top: 6px;
  margin-right: 4px;
}

.body .list {
  padding: 10px 20px 20px 20px;
  background: #fff fixed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  height: 100%;
  min-width: 504px;
}

.body .list .search {
  padding: 10px;
  margin-bottom: 20px;
}

.body .list .search .search_input {
  border-bottom: 1px rgb(167, 167, 167) inset;
  width: 220px;
  min-width: 220px;
  height: 30px;
  margin-right: 10px;
}

.body .list .search .search_input .input {
  height: 24px;
  background-color: white;
  box-shadow: none;
  border-radius: 4px;
  outline: none;
  border: none;
}

.body .list .search > div:last-child {
  flex-shrink: 0;
}

.item {
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
}

.item:hover {
  color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item .item-name {
  margin-left: 10px;
}

.database-icon {
  margin-right: 8px;
  margin-top: 8px;
}

.database-block {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  transition: box-shadow 0.3s;
}

.database-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.database-block img {
  max-width: 80px;
  max-height: 60px;
  object-fit: contain;
  user-select: none;
}

.custom-node {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  width: 100%;
  padding: 0 8px;
  font-size: 14px;
}

.node-label {
  flex: 1;
  margin-right: 12px;
  font-weight: 400;
}

.node-label:hover {
  color: #409eff;
}

.node-icon {
  font-size: 16px;
  color: #909399;
  cursor: pointer;
  transition: color 0.3s;
  -webkit-transform: rotate(90deg); /* Chrome/Safari */
  -moz-transform: rotate(90deg); /* Firefox */
  -ms-transform: rotate(90deg); /* IE9+ */
  -o-transform: rotate(90deg); /* Opera */
  transform: rotate(90deg);
}

.custom-menu {
  user-select: none;
  padding: 0;
}

.menu-item {
  padding: 2px 10px;
}

.menu-item:hover {
  background-color: #606266;
}

.pagination-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  width: 100%; /* 确保容器占满父级宽度 */
  margin-top: 20px;
}
</style>

