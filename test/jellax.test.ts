import Jellax from '../src/jellax'

const configuration = {
  apis: [
    {
      name: 'AOE2',
      servers: [
        {
          name: 'herokuapp.com',
          url: 'https://age-of-empires-2-api.herokuapp.com/api/v1/'
        }
      ],
      requests: [
        {
          name: 'civilization',
          path: 'civilization/{id}',
          parameters: [
            {
              name: 'id'
            }
          ],
          responses: ['200']
        }
      ]
    }
  ]
}

describe('Jellax', () => {
  it('Jellax', () => {
    const jellax = new Jellax(configuration)

    return jellax
      .api('AOE2')
      .server('herokuapp.com')
      .request('civilization')(2)
      .then(json => {
        expect(json).toMatchObject({
          id: 2,
          name: 'Britons',
          expansion: 'Age of Kings',
          army_type: 'Foot Archer',
          unique_unit: ['https://age-of-empires-2-api.herokuapp.com/api/v1/unit/longbowman'],
          unique_tech: ['https://age-of-empires-2-api.herokuapp.com/api/v1/technology/yeomen'],
          team_bonus: 'Archery Ranges work 20% faster',
          civilization_bonus: [
            'Town Centers cost -50% wood upon reaching the Castle Age',
            'Foot archers (excluding Skirmishers) have +1 range in Castle Age and +1 in Imperial Age (for +2 total)',
            'Shepherds work 25% faster'
          ]
        })
      })
  })
})
