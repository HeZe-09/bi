import { listChartByPageUsingPOST } from '@/services/mybi/chartController';

import { useModel } from '@@/exports';
import { Avatar, Card, List, message, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import Search from 'antd/es/input/Search';

/**
 * 添加图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 4,
    current: 1,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });
  const [chartList, setChartList] = useState<API.Chart>();
  const [total, setTotal] = useState<number>();

  const loadData = async () => {
    try {
      const res = await listChartByPageUsingPOST(searchParams);
      if (res.data) {
        // @ts-ignore
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);

        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败', e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart-page">
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: 6,
          total: total,
        }}
          // @ts-ignore
        dataSource={chartList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
            // @ts-ignore
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                  // @ts-ignore
                avatar={<Avatar src={currentUser.userAvatar} />}
                  // @ts-ignore
                title={item.name}
                  // @ts-ignore
                description={'图表类型：' + item.chartType}
              />
              <>
                {
                  // @ts-ignore
                  item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />

                    <p>{
                      // @ts-ignore
                      '分析目标' + item.goal
                    }
                    </p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={// @ts-ignore
                      item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}
                {// @ts-ignore
                  item.status === 'wait' && (
                  <>
                    <Result
                      status="info"
                      title="图表待生成......"
                      subTitle={// @ts-ignore
                      item.errorMessage ?? '图表生成系统繁忙请耐心等待'}
                    />
                  </>
                )}
                {// @ts-ignore
                  item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中......" subTitle={// @ts-ignore
                      item.errorMessage} />
                  </>
                )}
                {// @ts-ignore
                  item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={// @ts-ignore
                      item.errorMessage} />
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      ></List>
    </div>
  );
};
export default MyChartPage;
