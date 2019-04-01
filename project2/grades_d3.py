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

    # Compose result array of dictionaries for per pupil expense plot
    sel = [
        table.district_name,
        table.spg_score,
        func.avg(table.federal_ppe),
        func.avg(table.state_ppe),
        func.avg(table.local_ppe)
    ]
    results = db.session.query(*sel).group_by(table.district_name).all()

    results_data_list = []
    
    for result in results:
        result_data_dict = {}
        result_data_dict["district_name"] = result[0]
        result_data_dict["spg_score"] = result[1]
        result_data_dict["federal_ppe"] = result[2]
        result_data_dict["state_ppe"] = result[3]
        result_data_dict["local_ppe"] = result[4]

        results_data_list.append(result_data_dict)

    # Compose result array of dictionaries for teacher-student ratio
    sel1 = [
        table.school_name,
        table.spg_score,
        table.calc_student_teach_ratio
    ]
    results1 = db.session.query(*sel1).all()

    results_data_list1 = []
    
    for result1 in results1:
        result_data_dict1 = {}
        result_data_dict1["school_name"] = result1[0]
        result_data_dict1["spg_score"] = result1[1]
        result_data_dict1["calc_student_teach_ratio"] = result1[2]

        results_data_list1.append(result_data_dict1)
    
    # Compose the final return result array with the above arrays
    final = []
    final.append(results_data_list)
    final.append(results_data_list1)

    return jsonify(final)
    