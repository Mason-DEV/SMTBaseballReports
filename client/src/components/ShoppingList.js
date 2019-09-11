import React, {Component} from 'react';
import {Container, ListGroup, ListGroupItem, Button, Table} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getItems, deleteItem} from '../actions/itemActions';
import {  getAudits } from '../actions/auditActions';
import PropTypes from 'prop-types';


class ShoppingList extends Component{

    componentDidMount(){
        this.props.getAudits();
    }

    onDeleteClick = id => {
        this.props.deleteItem(id);
      };

        
   
      renderTableData() {
        const { items } = this.props.item;
        console.info("items",items);

        return items.map((audit, _id) => {
           const { id, gameID, auditor, operator, timeAccuracy} = audit //destructuring
           return (
              <tr key={id}>
                 <td>{gameID}</td>
                 <td>{operator}</td>
                 <td>{auditor}</td>
                 <td>{timeAccuracy}</td>
              </tr>
           )
        })
     }



    
    render(){
        return(
            <Container>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Gamestring</th>
                    <th>Operator</th>
                    <th>Auditor</th>
                    <th>Accuracy Time</th>
                  </tr>
                </thead>
                  <tbody>
                  {this.renderTableData()}
               </tbody>
              </Table>
          </Container>
        );
      }
    }
    
    {/* <ListGroup>
      <TransitionGroup className='shopping-list'>
        {items.map(({ _id, gameID }) => (
          <CSSTransition key={_id} timeout={500} classNames='fade'>
            <ListGroupItem>
             
                <Button
                  className='remove-btn'
                  color='danger'
                  size='sm'
                  onClick={this.onDeleteClick.bind(this, _id)}
                >
                  &times;
                </Button>
              {gameID}
            </ListGroupItem>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ListGroup> */}
    ShoppingList.propTypes = {
    getAudits: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item
})
export default connect(mapStateToProps, { getAudits, deleteItem })(ShoppingList);