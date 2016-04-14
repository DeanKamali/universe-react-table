import React from 'react';
import ReactDOM from 'react-dom';

import { isReactComponent } from './lib/is_react_component.jsx';
import { stringable } from './lib/stringable.jsx';
import { isUnsafe } from './unsafe.jsx';

export class Td extends React.Component {
    handleClick(e){
        if (typeof this.props.handleClick === 'function') {
            return this.props.handleClick(e, this);
        }
    }

    componentDidMount() {
        if (this.props.print) {
            const node = ReactDOM.findDOMNode(this);
            //this.setState({width: node.clientWidth});
        }

    }

    render() {
        var tdProps = {
            className: this.props.className,
            onClick: this.handleClick.bind(this)
        };

        // Attach any properties on the column to this Td object to allow things like custom event handlers
        if (typeof(this.props.column) === 'object') {
            for (var key in this.props.column) {
                if (key !== 'key' && key !== 'name') {
                    tdProps[key] = this.props.column[key];
                }
            }
            if (!tdProps.className && this.props.column.key) {
                tdProps.className = this.props.column.key;
            }
        }


        var data = this.props.data;

        if (typeof(this.props.children) !== 'undefined') {
            if (isReactComponent(this.props.children)) {
                data = this.props.children;
            } else if (
                typeof(this.props.data) === 'undefined' &&
                    stringable(this.props.children)
            ) {
                data = this.props.children.toString();
            }

            if (isUnsafe(this.props.children)) {
                tdProps.dangerouslySetInnerHTML = { __html: this.props.children.toString() };
            } else {
                tdProps.children = data;
            }
        }
        if (this.state && this.state.width) {
            tdProps.style = { width: this.state.width };
        }
        return <td {...tdProps} />;
    }
};
