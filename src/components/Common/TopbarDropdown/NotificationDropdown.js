import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from 'reactstrap'
import SimpleBar from 'simplebar-react'
import { getRelativeTime } from '../time'
import stockImg from '../../../assets/images/stock-default-icon.png'
import classnames from 'classnames'

const NotificationDropdown = () => {
    const [menu, setMenu] = useState(false)
    const { loading, error, data } = useQuery(GET_ALERTS_QUERY)

    const alertsLength = data?.getAlerts?.filter((n) => n.status == 'On').length

    return (
        <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="dropdown d-inline-block" tag="li">
            <DropdownToggle className="btn header-item noti-icon waves-effect" tag="button" id="page-header-notifications-dropdown">
                <i className="bx bx-bell"></i>
                {alertsLength > 0 && <span className="badge badge-danger badge-pill">{alertsLength}</span>}
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
                <div className="p-3">
                    <Row className="align-items-center">
                        <Col>
                            <h6 className="m-0"> {'Notifications'} </h6>
                        </Col>
                    </Row>
                </div>

                <SimpleBar style={{ maxHeight: '400px' }}>
                    {!error &&
                        !loading &&
                        data?.getAlerts
                            ?.filter((n) => n.status == 'On')
                            .sort((a, b) => b.alertOnDate - a.alertOnDate)
                            .map((alert, index) => (
                                <Link
                                    to={`/symbol/${alert.symbol}`}
                                    className="text-reset notification-item"
                                    key={index}
                                    onClick={() => setMenu(false)}
                                >
                                    <div className="media">
                                        <img
                                            src={`https://finnhub.io/api/logo?symbol=${alert.symbol}`}
                                            className="avatar-xs img-thumbnail rounded-circle d-inline-block mr-2"
                                            alt=""
                                            onError={(e) => {
                                                if (e.target.src != stockImg) e.target.src = stockImg
                                            }}
                                        />
                                        <div className="media-body">
                                            <h5
                                                className={classnames({
                                                    'font-size-14 mb-1': true,
                                                    'text-success': alert.signal == 'Buy',
                                                    'text-danger': alert.signal == 'Sell',
                                                })}
                                            >
                                                {alert.signal + ' ' + alert.symbol + ' : ' + alert.title}
                                            </h5>
                                            <div key={index} className="text-muted font-size-11 mb-1">
                                                {toProperCase(alert.conditions[0].timeframe) +
                                                    ' ' +
                                                    toProperCase(alert.conditions[0].indicator1) +
                                                    getOperatorSymbol(alert.conditions[0].operator, alert.conditions[0].isNegative) +
                                                    (alert.conditions[0].indicator2
                                                        ? toProperCase(alert.conditions[0].indicator2)
                                                        : alert.conditions[0].valueText) +
                                                    (alert.conditions[0].diff_percent > 0 ? ' (+' + alert.conditions[0].diff_percent + '%)' : '') +
                                                    ' ..'}
                                            </div>
                                            <p className="font-size-11 text-muted mb-0">
                                                <i className="mdi mdi-clock-outline"></i> {getRelativeTime(alert.alertOnDate)}{' '}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    {alertsLength == 0 && (
                        <div className="text-reset notification-item">
                            <div className="media">
                                <div className="media-body">
                                    <div className="font-size-12 text-muted">
                                        <p className="mb-1">{`No notifications yet.`}</p>
                                        <p className="mb-1">{`Configure some alerts to get notifications.`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SimpleBar>
            </DropdownMenu>
        </Dropdown>
    )
}

function getOperatorSymbol(operator, isNegative) {
    if (!operator) return '   '
    else if (isNegative) return operator == 'above' ? '  ≯  ' : '  ≮  '
    else return operator == 'above' ? '  >  ' : '  <  '
}

function toProperCase(text) {
    return text[0].toUpperCase() + text.substring(1)
}

export const GET_ALERTS_QUERY = gql`
    query getAlerts {
        getAlerts {
            id
            symbol
            signal
            title
            status
            alertOnDate
            conditions {
                order
                timeframe
                isNegative
                indicator1
                config1 {
                    length
                }
                operator
                indicator2
                config2 {
                    length
                }
                value
                valueText
                diff_percent
            }
        }
    }
`

export default NotificationDropdown
