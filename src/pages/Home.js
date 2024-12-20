import React, {useState, useEffect} from "react";

export default function App() {

  return (
    <React.Fragment>
      <section className="jumbotro pt-5 pb-5">
        <section className="container text-left">
          <h1 className="display-4">Project, front-end application!</h1>
          <p className="lead">This document/sample presents the struture for the front-end practical work for the ADAD course evaluation.</p>
          <hr className="my-4" />
          <p>Armazenamento de dados em ambientes distribuidos (ADAD) | Mestrado em Engenharia de Telecomunicações e Informática (METI)</p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="/books" role="button">Books &rarr;</a>
            <a className="btn btn-primary btn-lg ms-1" href="/users" role="button">Users &rarr;</a>
          </p>
        </section>
      </section>
      <section className="container mt-5 mb-5">
      <section className="row mb-5">
          <section className="col-md-4">
            <h2>Requirements for evaluation</h2>
            <ul>
              <li>Create /users page</li>
              <li>Create /user/:id page</li>
              <li>Create /book/:id page</li>
              <li>Edit BookCard component</li>
              <li>Inside /user/:id page create button to delete user from database</li>
                <li>Save a digital transaction proof of a rating</li>
            </ul>
          </section>
          <section className="col-md-4">
            <h2>Assessment components</h2>
            <p>Group report on the work done by each student of the group;<br/>
            Application developed;<br/>
            Oral discussion with individual questions.</p>
          </section>
          <section className="col-md-4">
            <h2>Delivery dates</h2>
            <p><span className="text-decoration-underline">Frontend Project upload</span> on Moodle by <strong>December 15 at 23h59</strong>;<br/>
            <span className="text-decoration-underline">Demo and answering to questions of the second part of the project (Frontend)</span> <strong>December 17</strong>.</p>
          </section>
        </section>
      </section>
    </React.Fragment>
  )
}