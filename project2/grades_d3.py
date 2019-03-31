import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

def get_data(db, table):

    # sel = [
    #     table.district_name,
    #     table.spg_score,
    #     table.calc_student_teach_ratio
    # ]
    # results = db.session.query(func.avg(table.spg_score), func.avg(table.calc_student_teach_ratio), table.district_name).group_by(table.district_name).all()
    sel = [
        table.district_name,
        table.spg_score,
        func.avg(table.federal_ppe),
        func.avg(table.state_ppe),
        func.avg(table.local_ppe)
    ]
    results = db.session.query(*sel).group_by(table.district_name).all()

    # Create a dictionary entry for each row of metadata information
    results_data_list = []
    
    for result in results:
        result_data_dict = {}
        result_data_dict["district_name"] = result[0]
        result_data_dict["spg_score"] = result[1]
        result_data_dict["federal_ppe"] = result[2]
        result_data_dict["state_ppe"] = result[3]
        result_data_dict["local_ppe"] = result[4]

        #print(result_data_dict)

        results_data_list.append(result_data_dict)

    return jsonify(results_data_list)
    