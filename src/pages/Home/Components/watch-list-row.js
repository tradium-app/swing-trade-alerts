import React from 'react'
import { Link } from 'react-router-dom'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import stockImg from '../../../assets/images/stock-default-icon.png'

const WatchListRow = ({ stock, showAlertList, showNewsList }) => {
    return (
        <tr>
            <td>
                <Link onClick={() => showAlertList(stock.symbol, 'Buy')} className={stock.isBuyAlert ? 'text-success' : 'text-muted'} to="#">
                    {stock.isBuyAlert ? <i className="mdi mdi-bell-ring font-size-18"></i> : <i className="mdi mdi-bell-outline font-size-18"></i>}
                </Link>
            </td>
            <td>
                <Link onClick={() => showAlertList(stock.symbol, 'Sell')} className={stock.isSellAlert ? 'text-danger' : 'text-muted'} to="#">
                    {stock.isSellAlert ? <i className="mdi mdi-bell-ring font-size-18"></i> : <i className="mdi mdi-bell-outline font-size-18"></i>}
                </Link>
            </td>
            <td style={{ textAlign: 'left' }}>
                <Link to={`/symbol/${stock.symbol.toUpperCase()}`} className="ml-1">
                    <img
                        src={`https://finnhub.io/api/logo?symbol=${stock.symbol}`}
                        alt=""
                        className="avatar-xs img-thumbnail rounded-circle d-inline-block mr-2"
                        onError={(e) => {
                            if (e.target.src != stockImg) e.target.src = stockImg
                        }}
                    />
                    <h5 className="font-size-13 d-inline-block text-primary">{stock.symbol.toUpperCase()}</h5>
                </Link>
            </td>
            <td>{Math.floor(stock.price)}</td>
            <td className={stock.changePercent < 0 ? 'text-danger' : 'text-success'}>{Math.abs(stock.changePercent).toFixed(2)}</td>
            <td className="p-0 d-flex justify-content-center align-items-center">
                <div style={{ width: 50, height: 40 }}>
                    {stock.last30DaysClosePrices && (
                        <Sparklines data={stock.last30DaysClosePrices} svgWidth={80} svgHeight={30} margin={5} limit={30}>
                            <SparklinesLine />
                        </Sparklines>
                    )}
                </div>
            </td>
            <td>{formatMarketCap(stock.marketCap)}</td>
            <td>
                <div className="text-muted font-size-10 d-inline-block mr-2">{Math.floor(stock.week52Low)}</div>
                <div className="d-inline-block">
                    <input
                        type="range"
                        className="form-control-range"
                        min={Math.floor(stock.week52Low)}
                        max={Math.floor(stock.week52High)}
                        value={Math.floor(stock.price)}
                        disabled
                        style={{ width: '50px' }}
                    />
                </div>
                <div className="text-muted font-size-10 d-inline-block ml-2">{Math.floor(stock.week52High)}</div>
            </td>
            <td>{stock.beta.toFixed(1)}</td>
            <td>{stock.revenueGrowthQuarterlyYoy.toFixed(0)}</td>
            <td>{stock.revenueGrowthTTMYoy.toFixed(0)}</td>
            <td>{stock.redditRank < 999 ? stock.redditRank : ''}</td>
            <td>{stock.rsi != 100 && stock.rsi != 0 && stock.rsi.toFixed(0)}</td>
            <td>
                <div className="font-size-16">
                    <i className={stock.trend == 'Up' ? 'bx bx-up-arrow-alt text-success' : 'bx bx-down-arrow-alt text-danger'}></i>
                </div>
            </td>
            <td>
                <div className="font-size-16">
                    {stock?.news > 0 && (
                        <Link
                            onClick={() => {
                                showNewsList(stock.symbol)
                            }}
                            to="#"
                        >
                            <span className="badge badge-primary badge-pill">{stock?.news}</span>
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    )
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatMarketCap(x) {
    if (x > 1000) {
        return numberWithCommas(Math.floor(x / 1000)) + 'B'
    } else {
        return numberWithCommas(Math.floor(x)) + 'M'
    }
}

export default WatchListRow
