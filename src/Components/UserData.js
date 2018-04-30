import React, { Component } from 'react';
import { Statistic, Segment, Button, Table } from 'semantic-ui-react'
import _ from 'underscore';
export default class UserTable extends Component {
    constructor(props) {
        super(props);
        this.startProcessing = this.startProcessing.bind(this);
        this.getProcessedArray = this.getProcessedArray.bind(this);
        this.getOccurenceArray = this.getOccurenceArray.bind(this);
        this.getCompanies = this.getCompanies.bind(this);
        this.state = {
            occurenceArray: [],
            companiesArray: []
        }
        this.occurenceContainer = {};
        this.processedArray = [];
    }
    /**
     * Manipulating array retrieved  from api.
     */
    startProcessing() {
        let myUserArray = [];
        let apiArray = this.props.dataSet;
        for (let i = 0; i < apiArray.length; i++) {
            myUserArray.push(apiArray[i].companyName.split(' '));
        }
        this.processedArray = this.getProcessedArray(myUserArray);
        let top5occurenceArray = this.getOccurenceArray(this.processedArray);
        //let top5Companies = this.getCompanies(processedArray, top5occurenceArray);
        this.setState({
            occurenceArray: top5occurenceArray
        });


    }
    /**
     * Removing the words of length <=2 and common words like the,in,at,and
     */
    getProcessedArray(array) {
        let commonEnglishWords = ['and', 'the']
        let length1 = array.length;
        for (let i = 0; i < length1; i++) {
            let length2 = array[i].length;
            for (let j = 0; j < length2; j++) {
                if (commonEnglishWords.includes(array[i][j].toLowerCase()) || array[i][j].length < 3) {
                    array[i][j] = "";
                }
            }
        }
        return array;
    }
    getOccurenceArray(array) {

        let length = array.length;
        let occurenceContainer = {};
        let intersectionArray = [];
        for (let i = 0; i < length - 2; i++) {
            for (let j = 1; j < length - i; j++) {
                intersectionArray = _.intersection(array[i], array[j]);
                if (intersectionArray.length > 0) {
                    for (let k = 0; k < intersectionArray.length; k++) {
                        if (intersectionArray[k] !== "") {
                            if (occurenceContainer[intersectionArray[k]] == null || occurenceContainer[intersectionArray[k]] == undefined) {
                                occurenceContainer[intersectionArray[k]] = 1;
                            } else {
                                occurenceContainer[intersectionArray[k]]++;
                            }
                        }
                    }
                }
            }
        }
        var keys = Object.keys(occurenceContainer);
        keys.sort(function (a, b) {
            return occurenceContainer[b] - occurenceContainer[a];

        });

        this.occurenceContainer = occurenceContainer;
        return keys.slice(0, 5);

    }
    getCompanies(event) {

        let word = event.target.innerHTML;
        let processedArray = this.processedArray;
        let length1 = processedArray.length;
        let companiesIndex = [];
        for (let i = 0; i < length1; i++) {
            let length2 = processedArray[i].length;
            for (let j = 0; j < length2; j++) {
                if (processedArray[i][j] !== "") {
                    if (processedArray[i].includes(word) == true) {
                        companiesIndex.push(i);

                    }

                }
            }
        }
        this.setState({
            companiesArray: [...new Set(companiesIndex)].splice(0, 5)
        })
    }
    render() {
        return (
            <div >
                <Segment inverted>
                    <Statistic.Group inverted>
                        <Statistic>
                            <Statistic.Value></Statistic.Value>
                            <Statistic.Label></Statistic.Label>
                            <Statistic.Value>{this.props.dataSet.length}</Statistic.Value>
                            <Statistic.Label>users data has been received</Statistic.Label>
                            <Statistic.Value></Statistic.Value>
                            <Statistic.Label></Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Segment>
                <Button secondary onClick={this.startProcessing}>Start Processing</Button><br />
                <div className='row'>
                    {this.state.occurenceArray.length > 0 &&
                        <div className="col-md-6">
                            <br /><br />
                            <span>=======================================RESULTS========================================</span>
                            <Table celled collapsing>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Most Occured Words</Table.HeaderCell>
                                        <Table.HeaderCell>Occurences</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        this.state.occurenceArray.map((value, key) => {
                                            return (<Table.Row key={key}>
                                                <Table.Cell><Button onClick={this.getCompanies}>{value}</Button></Table.Cell>
                                                <Table.Cell>{this.occurenceContainer[value]}</Table.Cell>
                                            </Table.Row>)
                                        })
                                    }

                                </Table.Body>
                            </Table>
                        </div>
                    }
                    {this.state.companiesArray.length > 0 &&
                        <div className="col-md-6">
                            <br /><br />
                            <Table celled collapsing>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Company Name</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        this.state.companiesArray.map((value, key) => {
                                            return (<Table.Row key={key}>
                                                <Table.Cell>{this.props.dataSet[value].companyName}</Table.Cell>
                                            </Table.Row>)
                                        })
                                    }

                                </Table.Body>
                            </Table>
                        </div>
                    }
                </div>

            </div>
        );
    }
}
