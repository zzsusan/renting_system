import React, { Component } from 'react';
import axios from 'axios';
import { Checkbox, Button, Divider, DatePicker, Input, InputNumber, Row, Col, Form, message } from 'antd';
import moment from 'moment';

const CheckboxGroup = Checkbox.Group;

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_value: {},
            results: null
        }
    }

    // Checkbox onchange
    onChange = (checkedValue) => {
        let new_search_value = {};
        checkedValue.forEach(val => {
            new_search_value[val] = true
        });
        console.log(new_search_value);
        this.setState({ search_value: new_search_value }, () => {
            console.log("state", this.state.search_value);
        });
    }

    search = (searchValue) => {
        // const searchValue = JSON.stringify(this.state.search_value);
        axios.post('/pillow/search/adv_search/', searchValue).then(res => {
            console.log(res.data.response.results);
            if (res?.data?.response?.error === "NONE") {
                message.error("No result found!");
            }
            if (res?.data?.response?.results !== '') {
                const results = res.data.response.results;
                console.log(results);
                this.setState({ results });
            }
        }).catch(error => console.log(error.response));
    }

    // name = request.data.get('name') input
    // gym = request.data.get('gym') boolean
    // parking = request.data.get('parking') boolean
    // utility = request.data.get('utility') int(0-6)
    // laundry = request.data.get('laundry') boolean
    // swimming_pool = request.data.get('swimming_pool') boolean
    // min_price = request.data.get('min_price') input number
    // max_price = request.data.get('max_price') input number
    // start_date = request.data.get('start_date') input time 
    // mean_rate = request.data.get('mean_rate') >= input

    // inputName = () => (<Input onChange={(e) => {
    //     console.log();
    // }} placeholder="Please input the apartment name you want to explore"></Input>);

    FourCheckboxGroup = ({onChange}) => (<CheckboxGroup style={{ width: '40%' }} onChange={onChange}>
        <Row>
            <Col span={8}><Checkbox value="gym">gym</Checkbox></Col>
            <Col span={8}><Checkbox value="parking">parking</Checkbox></Col>
            <Col span={8}><Checkbox value="laundry">laundry</Checkbox></Col>
            <Col span={8}><Checkbox value="swimming_pool">swimming_pool</Checkbox></Col>
        </Row>
    </CheckboxGroup>);

    onFinish = (value) => {
        const { min_price, max_price, mean_rate } = value;
        const request = { min_price, max_price, mean_rate };
        if (value.name && value.name !== " ") {
            request.name = value.name;
        }
        if (value.fourcheckbox) {
            const checkedValue = value.fourcheckbox;
            checkedValue.forEach(val => {
                request[val] = true;
            });
        }
        if (value.start_date) {
            const standard = value.start_date.format("YYYY-MM-DD");
            request.start_date = standard;
        }
        if (min_price) {
            request.min_price = min_price;
        }
        if (max_price) {
            request.max_price = max_price;
        }
        if (mean_rate) {
            request.mean_rate = mean_rate;
        }
        console.log("request value", request);
        this.search(request);
    }

    // the whole search form
    form = () => (
        <Form name="search_form" onFinish={this.onFinish}>
            <Form.Item name="name">
                <Input onChange={(e) => {console.log("input1", e.target.value)}} 
                    placeholder="Please input the apartment name you want to explore" />
            </Form.Item>
            <Form.Item name="fourcheckbox">
                <this.FourCheckboxGroup onChange={this.onChange} />
            </Form.Item>
            <Form.Item name="min_price" label="Min Price">
                <InputNumber min={500} max={1000}></InputNumber>
            </Form.Item>
            <Form.Item name="max_price" label="Max Price">
                <InputNumber min={500} max={1000}></InputNumber>
            </Form.Item>
            <Form.Item name="start_date" label="Start Date">
                <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item name="mean_rate" label="Min Rate">
                <InputNumber min={0} max={5} step={0.5}></InputNumber>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
            </Form.Item>
        </Form>
    );
    render() {
        const results = this.state.results;
        return (<div><h1>Search</h1>
            < this.form />
            {results && <div id="searchResult">result</div>}
        </div>)
    }
}

export default Search;