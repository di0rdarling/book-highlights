import express from 'express';
import Highlight from '../models/highlight';
import HighlightCreate from '../models/highlight';
import mongoose from 'mongoose';
import { config } from '../config/config';

export const highlightRouter = express.Router();
mongoose.set('bufferCommands', false)

highlightRouter.post("/highlight", async (request, response) => {
    mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        await new HighlightCreate(request.body)
            .save()
            .then((highlight) => {
                response.sendStatus(201);
            })
            .catch((err) => {
                response.status(500).send(err);
            });
    }).catch(err => {
        console.log(err)
    });

});

highlightRouter.get("/highlights", async (request, response) => {
    mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        await Highlight
            .find({})
            .then((highlights) => {
                response.status(200).send(highlights);
            })
            .catch((err) => {
                response.status(500).send(err);
            });
    }).catch(err => {
        console.log(err)
    });
});

highlightRouter.get("/highlight/:_id", async (request, response) => {
    await Highlight.findById(request.params._id)
        .exec()
        .then((highlight) => {
            response.status(200).send(highlight);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.put("/highlight/:_id", async (request, response) => {
    await Highlight.findByIdAndUpdate(request.params._id, request, {
        new: true,
    })
        .then((highlightEdit) => {
            console.log('he', highlightEdit)
            response.status(200).send(highlightEdit);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.delete("/highlight/delete/:_id", async (request, response) => {
    await Highlight.findByIdAndRemove(request.params._id)
        .then((res) => {
            response.sendStatus(200);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});
