import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';

export default async (req, res) => {
    const transaction = JSON.parse(req.body);

    try {
        await fauna.query(
            q.Create(
                q.Collection('transactions'),
                { data: { transaction } }
            )
        )

        return true;

    } catch(err) {
        console.log(err);
        return false;
    }

}