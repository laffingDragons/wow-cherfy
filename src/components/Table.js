import React from 'react'

export default function Table({ tableData }) {
    return (
        <>
            <table class="table table-dark table-striped">
                <thead>
                    <tr className='text-center'>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Unit price</th>
                        <th scope="col">Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length ? tableData.map(product => {
                        return (
                            <tr className='text-center' key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.unitPrice}</td>
                                <td>{product.sold}</td>
                            </tr>
                        )
                    }) : <tr>
                            <td colSpan={4}>No products found</td>
                        </tr>}
                </tbody>
            </table>
        </>
    )
}
