import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate } from 'react-jhipster';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntitiesForLoggedUser, selectCategory } from 'app/entities/category/category.reducer';

export interface ICategoryProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class PrePlayroom extends React.Component<ICategoryProps> {
  componentDidMount() {
    this.props.getEntitiesForLoggedUser();
  }

  selectCategory = (event, errors, values) => {
    if (errors.length === 0) {
      const { categoryEntity } = this.props;
      const entity = {
        ...categoryEntity,
        ...values.category
      };

      this.props.selectCategory(entity);
      this.props.history.push('/flashcards/playroom');
    }
  };

  randomSelect = () => {
    const { categoryList } = this.props;
    const randomCategory = categoryList[Math.floor(Math.random() * categoryList.length)];

    this.props.selectCategory(randomCategory);
    this.props.history.push('/flashcards/playroom');
  };

  render() {
    const { categoryList, loading, updating } = this.props;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="learnerappApp.preplayroom.selectLabel">
              <Translate contentKey="preplayroom.selectLabel">Select category</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm onSubmit={this.selectCategory}>
                <AvGroup>
                  <AvInput
                    id="category"
                    type="select"
                    className="form-control"
                    name="category.id"
                    value={categoryList ? categoryList[0] && categoryList[0].id : ''}
                  >
                    <option value="" key="0" />
                    {categoryList
                      ? categoryList.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button color="info" id="randomize" onClick={this.randomSelect} disabled={updating}>
                  <FontAwesomeIcon icon="dice" />&nbsp;
                  <Translate contentKey="preplayroom.randomize">Random Category</Translate>
                </Button>
                &nbsp;
                <Button color="primary" id="select" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="hand-pointer" />&nbsp;
                  <Translate contentKey="preplayroom.select">Select Category</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ category }: IRootState) => ({
  categoryList: category.entities,
  categoryEntity: category.entity,
  loading: category.loading,
  updating: category.updating
});

const mapDispatchToProps = {
  getEntitiesForLoggedUser,
  selectCategory
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrePlayroom);
